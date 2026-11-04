const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const sourceRoot = path.resolve(__dirname, '..');

function fixture(t) {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'wierzba-publish-test-'));
    t.after(() => fs.rmSync(temporary, { recursive: true, force: true }));
    const home = path.join(temporary, 'home');
    const root = path.join(home, 'public_html');
    const state = path.join(home, '.local/state/wierzba');
    const repository = path.join(state, 'repository.git');
    const remote = path.join(temporary, 'remote.git');
    const seed = path.join(temporary, 'seed');
    const env = {
        ...process.env, HOME: home, GIT_CONFIG_NOSYSTEM: '1',
        GIT_CONFIG_GLOBAL: '/dev/null', GIT_TERMINAL_PROMPT: '0'
    };
    for (const directory of [root, state, seed]) fs.mkdirSync(directory, { recursive: true });
    function run(command, args, expected = 0) {
        const result = spawnSync(command, args, { cwd: root, env, encoding: 'utf8', timeout: 60000 });
        assert.ifError(result.error);
        assert.equal(result.status, expected, result.stdout + result.stderr);
        return result;
    }
    const git = (...args) => run('git', args).stdout.trim();
    const local = (...args) => git(`--git-dir=${repository}`, `--work-tree=${root}`, ...args);
    git('init', '-b', 'main', seed);
    git('-C', seed, 'config', 'user.name', 'Publishing test');
    git('-C', seed, 'config', 'user.email', 'test@example.invalid');
    fs.writeFileSync(path.join(seed, 'README.md'), 'Initial README\n');
    git('-C', seed, 'add', '.');
    git('-C', seed, 'commit', '-m', 'Initial commit');
    git('clone', '--bare', seed, remote);
    git('clone', '--bare', remote, repository);
    local('config', 'core.bare', 'false');
    local('config', 'core.worktree', root);
    local('config', 'remote.origin.fetch', '+refs/heads/*:refs/remotes/origin/*');
    local('config', 'user.name', 'Publishing test');
    local('config', 'user.email', 'test@example.invalid');
    local('read-tree', 'HEAD');
    for (const file of [
        '.gitignore', 'scripts/publish.sh', 'scripts/reindex.sh',
        'dh/index.html', 'dh/web/media/index.css', 'dh/web/media/index.js'
    ]) {
        fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
        fs.copyFileSync(path.join(sourceRoot, file), path.join(root, file));
    }
    fs.writeFileSync(path.join(root, 'README.md'), 'Updated website\n');
    return {
        root, remote, repository, seed, git, local,
        publish: (expected = 0) => run('bash', ['scripts/publish.sh'], expected),
        remoteHead: () => git(`--git-dir=${remote}`, 'rev-parse', 'main'),
        write(file, content) {
            fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
            fs.writeFileSync(path.join(root, file), content);
        }
    };
}

test('publication commits real changes, ignores private files and leaves unchanged runs alone', t => {
    const project = fixture(t);
    project.write('.env', 'NOT_A_REAL_SECRET=fixture');
    project.write('dh/demo/.env.local', 'fixture');
    project.write('dh/.vscode/settings.json', '{}');
    project.write('dh/bazy-danych/test.php', 'private exercise');
    project.write('dh/website/.noindex', '');
    project.write('dh/website/index.html', '<h1>Keep this website</h1>');
    const before = project.remoteHead();
    project.publish();
    const first = project.remoteHead();
    assert.notEqual(first, before);
    const tracked = project.git(`--git-dir=${project.remote}`, 'ls-tree', '-r', '--name-only', 'main');
    assert.doesNotMatch(tracked, /\.env|settings\.json|test\.php/);
    assert.ok(tracked.includes('dh/website/.noindex'));
    assert.equal(project.git(`--git-dir=${project.remote}`, 'show', 'main:dh/website/index.html'), '<h1>Keep this website</h1>');
    assert.ok(project.git(`--git-dir=${project.remote}`, 'log', '-1', '--format=%B')
        .includes('Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>'));
    project.publish();
    assert.equal(project.remoteHead(), first);
    project.write('note.txt', 'new content');
    project.publish();
    assert.notEqual(project.remoteHead(), first);
    fs.unlinkSync(path.join(project.root, 'note.txt'));
    project.publish();
    assert.ok(!project.git(`--git-dir=${project.remote}`, 'ls-tree', '-r', '--name-only', 'main').includes('note.txt'));
    assert.ok(!fs.existsSync(path.join(project.root, '.git')));
});

test('a failed push is visible and the existing commit is pushed on retry without duplication', t => {
    const project = fixture(t);
    const hook = path.join(project.remote, 'hooks/pre-receive');
    fs.writeFileSync(hook, '#!/bin/sh\nexit 1\n', { mode: 0o755 });
    const before = project.remoteHead();
    project.publish(1);
    const pending = project.local('rev-parse', 'HEAD');
    assert.notEqual(pending, before);
    assert.equal(project.remoteHead(), before);
    fs.unlinkSync(hook);
    project.publish();
    assert.equal(project.remoteHead(), pending);
    assert.equal(project.local('rev-parse', 'HEAD'), pending);
});

test('remote-only commits stop publishing rather than rewriting main', t => {
    const project = fixture(t);
    project.git('-C', project.seed, 'remote', 'add', 'origin', project.remote);
    fs.writeFileSync(path.join(project.seed, 'outside.txt'), 'external change');
    project.git('-C', project.seed, 'add', '.');
    project.git('-C', project.seed, 'commit', '-m', 'External edit');
    project.git('-C', project.seed, 'push', 'origin', 'main');
    const remote = project.remoteHead();
    const local = project.local('rev-parse', 'HEAD');
    assert.match(project.publish(1).stderr, /obce zmiany/);
    assert.equal(project.remoteHead(), remote);
    assert.equal(project.local('rev-parse', 'HEAD'), local);
});

test('forced private files and recognizable token fixtures never reach a commit', t => {
    for (const kind of ['private-file', 'token']) {
        const project = fixture(t);
        const before = project.remoteHead();
        if (kind === 'private-file') {
            project.write('.env', 'fixture');
            project.local('add', '-f', '.env');
        } else {
            project.write('accidental.txt', ['ghp_', 'A'.repeat(36)].join(''));
        }
        assert.match(project.publish(1).stderr, /Niedozwolony plik|Podejrzenie klucza/);
        assert.equal(project.local('rev-parse', 'HEAD'), before);
        assert.equal(project.remoteHead(), before);
    }
});

test('GitHub-size-limit files stop publishing explicitly', t => {
    const project = fixture(t);
    project.write('large.bin', '');
    fs.truncateSync(path.join(project.root, 'large.bin'), 104857600);
    const before = project.remoteHead();
    assert.match(project.publish(1).stderr, /100 MiB/);
    assert.equal(project.remoteHead(), before);
    assert.equal(project.local('rev-parse', 'HEAD'), before);
});

test('an indexing error stops publication before staging and pushing', t => {
    const project = fixture(t);
    project.write('dh/custom/index.html', '<h1>No generation marker</h1>');
    const before = project.remoteHead();
    assert.match(project.publish(1).stderr, /Chroniony index.html/);
    assert.equal(project.remoteHead(), before);
    assert.equal(project.local('rev-parse', 'HEAD'), before);
});
