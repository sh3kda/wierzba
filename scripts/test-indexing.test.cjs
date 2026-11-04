const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { test } = require('node:test');

const sourceRoot = path.resolve(__dirname, '..');
const favicon = '<link rel="icon" type="image/svg+xml" href="https://wierzba.wzks.uj.edu.pl/~25_dawid/dh/web/media/UJ_favicon.svg">';

function fixture(t) {
    const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'wierzba-index-test-')));
    t.after(() => fs.rmSync(root, { recursive: true, force: true }));
    for (const file of ['index.html', 'dh/index.html', 'scripts/reindex.sh', 'dh/web/media/index.css', 'dh/web/media/index.js']) {
        fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
        fs.copyFileSync(path.join(sourceRoot, file), path.join(root, file));
    }
    fs.mkdirSync(path.join(root, 'web'));
    return {
        root,
        mkdir(relative) {
            fs.mkdirSync(path.join(root, relative), { recursive: true });
        },
        write(relative, content) {
            fs.writeFileSync(path.join(root, relative), content);
        },
        index(relative = '') {
            return fs.readFileSync(path.join(root, relative, 'index.html'), 'utf8');
        },
        run(args = [], expectedStatus = 0, entryPoint = 'scripts/reindex.sh') {
            const result = spawnSync('bash', [path.join(root, entryPoint), ...args], {
                cwd: os.tmpdir(),
                encoding: 'utf8',
                timeout: 30000
            });
            assert.ifError(result.error);
            assert.equal(result.status, expectedStatus, result.stdout + result.stderr);
            return result;
        }
    };
}

function entryLinks(html) {
    return [...html.matchAll(/<a class="entry-name[^"]*" href="([^"]+)">/g)].map(match => match[1]);
}

function encoded(name) {
    return encodeURIComponent(name).replace(/[!'()*]/g, character =>
        `%${character.charCodeAt(0).toString(16).toUpperCase()}`);
}

function homepageParts(html) {
    const start = html.indexOf('<!-- DYNAMIC_LINKS_START -->');
    const end = html.indexOf('<!-- DYNAMIC_LINKS_END -->');
    assert.ok(start >= 0 && end > start);
    const contentStart = html.indexOf('\n', start) + 1;
    const contentEnd = html.lastIndexOf('\n', end) + 1;
    return {
        before: html.slice(0, contentStart),
        links: html.slice(contentStart, contentEnd),
        after: html.slice(contentEnd)
    };
}

test('recursive indexing covers public folders, sizes, assets, exclusions and repeatability', t => {
    const project = fixture(t);
    for (const directory of ['empty', 'web/lab/sub', '.vscode', 'web/.private', 'web/node_modules/pkg']) {
        project.mkdir(directory);
    }
    project.write('root-file.txt', 'Automatically listed at the public root');
    project.write('web/a.txt', '');
    project.write('web/z.bin', Buffer.alloc(1536));
    project.write('.DS_Store', 'hidden');
    project.write('web/.private/secret.txt', 'hidden');
    fs.symlinkSync(path.join(project.root, 'web'), path.join(project.root, 'alias'));
    fs.symlinkSync(path.join(project.root, 'web/a.txt'), path.join(project.root, 'linked.txt'));
    project.run(['--recursive']);

    const directories = ['', 'dh', 'dh/web', 'dh/web/media', 'empty', 'web', 'web/lab', 'web/lab/sub'];
    const before = directories.map(directory => project.index(directory));
    for (let i = 0; i < directories.length; i++) {
        const html = before[i];
        const directory = directories[i];
        assert.ok(html.includes('<body class="dark-theme">'));
        assert.ok(html.includes('<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">'));
        const authorUrl = html.match(/<link rel="author" type="text\/plain" href="([^"]+)">/)[1];
        assert.equal(path.resolve(project.root, directory, authorUrl), path.join(project.root, 'humans.txt'));
        assert.ok(html.includes(favicon));
        assert.equal(entryLinks(html)[0], '../');
        assert.ok(html.includes('<strong>../</strong>'));
        assert.ok(html.includes('id="dir-filter"'));
        assert.equal((html.match(/<svg class="theme-icon"/g) || []).length, 2);
        assert.ok(!html.includes(project.root));
        assert.ok(!html.includes('[DIR]') && !html.includes('[FILE]'));
        const serverPath = `~25_dawid/${directory ? directory + '/' : ''}`;
        assert.ok(html.includes(`<h1>${serverPath}</h1>`));
        assert.ok(html.includes(`<title>${serverPath}</title>`));
        assert.ok(!html.includes('Index of'));
        for (const [pattern, asset] of [
            [/<link rel="stylesheet" href="([^"]+)">/, 'index.css'],
            [/<script src="([^"]+)" defer>/, 'index.js']
        ]) {
            const url = html.match(pattern)[1];
            assert.equal(path.resolve(project.root, directory, url), path.join(project.root, 'dh/web/media', asset));
        }
        assert.equal(fs.statSync(path.join(project.root, directory, 'index.html')).mode & 0o777, 0o644);
    }
    assert.deepEqual(entryLinks(project.index()), ['../', './dh/', './empty/', './web/', './root-file.txt']);
    assert.match(project.index(), /<strong>empty\/<\/strong>/);
    assert.ok(project.index().includes('root-file.txt'));
    assert.match(project.index('web'), /data-bytes="0" title="0 B">0 B/);
    assert.match(project.index('web'), /data-bytes="1536" title="1536 B">1\.5 KB/);
    assert.match(project.index('empty'), /id="empty-state"[^>]*role="status">/);
    for (const directory of ['bin', 'scripts', '.vscode', 'web/.private', 'web/node_modules/pkg']) {
        assert.ok(!fs.existsSync(path.join(project.root, directory, 'index.html')));
    }
    project.run(['--recursive']);
    assert.deepEqual(directories.map(directory => project.index(directory)), before);
    assert.ok(!fs.readdirSync(project.root).some(name => name.startsWith('.index.html.')));
});

test('HTML escaping and URL encoding handle Unicode, punctuation, backslashes and newlines', t => {
    const project = fixture(t);
    const directory = 'web/\u0107wiczenia #1 & "<tag>"';
    const names = [
        'Za\u017c\u00f3\u0142\u0107 & <img onerror=\'x\'> " #?%+.txt',
        'javascript:alert(1).txt',
        'literal\\n.txt',
        'line\n.txt',
        '--option.txt'
    ];
    project.mkdir(directory);
    for (const name of names) {
        project.write(`${directory}/${name}`, 'abc');
    }
    project.run(['--recursive', '--', 'web']);
    const html = project.index(directory);
    for (const name of names) {
        assert.ok(entryLinks(html).includes(`./${encoded(name)}`), `Missing encoded link: ${JSON.stringify(name)}`);
    }
    assert.ok(html.includes('&amp; &lt;img onerror=&#39;x&#39;&gt; &quot; #?%+.txt'));
    assert.ok(html.includes('line&#10;.txt'));
    assert.ok(html.includes('literal\\n.txt'));
    assert.ok(!html.includes('<img onerror='));
    assert.ok(html.includes('<title>~25_dawid/web/\u0107wiczenia #1 &amp; &quot;&lt;tag&gt;&quot;/</title>'));
    assert.ok(entryLinks(project.index('web')).includes(`./${encoded(path.basename(directory))}/`));
});

test('new nested folders update every ancestor and accept paths as literal arguments', t => {
    const project = fixture(t);
    const folder = 'web/lab 01/$(touch unwanted); # & \u017c\n';
    project.run(['--new', '--', folder]);
    for (const directory of ['', 'web', 'web/lab 01', folder]) {
        assert.ok(project.index(directory).includes('<body class="dark-theme">'));
    }
    assert.ok(entryLinks(project.index('web')).includes('./lab%2001/'));
    assert.ok(entryLinks(project.index('web/lab 01')).includes(`./${encoded(path.basename(folder))}/`));
    assert.ok(!fs.existsSync(path.join(project.root, 'unwanted')));
    project.run(['--new', '--', folder], 1);
    project.run(['--new', '--', '--leading-dash']);
    assert.ok(fs.existsSync(path.join(project.root, '--leading-dash/index.html')));
});

test('new public directories stay traversable with a restrictive caller umask', t => {
    const project = fixture(t);
    const result = spawnSync('bash', [
        '-c', 'umask 077; exec bash "$@"', '--',
        path.join(project.root, 'scripts/reindex.sh'), '--new', 'web/public/leaf'
    ], { encoding: 'utf8', timeout: 30000 });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stderr);
    for (const directory of ['web/public', 'web/public/leaf']) {
        assert.equal(fs.statSync(path.join(project.root, directory)).mode & 0o777, 0o755);
        assert.equal(fs.statSync(path.join(project.root, directory, 'index.html')).mode & 0o777, 0o644);
    }
});

test('single-folder indexing and absolute paths have consistent semantics', t => {
    const project = fixture(t);
    const homepageBefore = project.index();
    project.mkdir('web/lab');
    project.run(['--', path.join(project.root, 'web')]);
    assert.equal(project.index(), homepageBefore);
    assert.ok(!fs.existsSync(path.join(project.root, 'web/lab/index.html')));
    const before = project.index('web');
    project.run(['--', 'web']);
    assert.equal(project.index('web'), before);
    project.run();
    assert.ok(project.index().includes('<h1>~25_dawid/</h1>'));
});

test('unmarked pages are protected before any recursive or new-folder writes', t => {
    const project = fixture(t);
    const homepageBefore = project.index();
    const original = '<!DOCTYPE html><p>Keep this page</p>';
    project.write('web/index.html', original);
    project.run(['--recursive'], 1);
    assert.equal(project.index('web'), original);
    assert.equal(project.index(), homepageBefore);
    project.run(['--new', '--', 'web/new/child'], 1);
    assert.ok(!fs.existsSync(path.join(project.root, 'web/new')));
    project.run(['--recursive', '--force']);
    assert.ok(project.index('web').includes('Generated by scripts/reindex.sh'));
});

test('invalid input, outside paths, technical folders and symbolic-link outputs fail explicitly', t => {
    const project = fixture(t);
    const homepageBefore = project.index();
    project.write('file.txt', 'unchanged');
    project.mkdir('.private');
    fs.symlinkSync(path.join(project.root, '.private'), path.join(project.root, 'linked'));
    for (const args of [
        ['missing'], [''], ['--new'], ['--new', '--recursive', 'new'],
        ['--unknown'], ['web', 'web/media'], ['--'],
        ['--new', '../outside'], ['--new', '/tmp/outside-wierzba'],
        ['--new', 'scripts/new'], ['--new', '.private/new'],
        ['--new', 'web/node_modules/new'], ['--new', 'linked/new'],
        ['--new', 'file.txt/child'], ['--exclude'], ['--exclude', ''],
        ['--exclude', '--recursive'], ['--exclude', '../outside'],
        ['--exclude', 'file.txt']
    ]) {
        const result = project.run(args, 1);
        assert.match(result.stderr, /Blad:/);
    }
    fs.symlinkSync(path.join(project.root, 'file.txt'), path.join(project.root, 'web/index.html'));
    project.run(['--force', '--', 'web'], 1);
    assert.equal(fs.readFileSync(path.join(project.root, 'file.txt'), 'utf8'), 'unchanged');
    fs.unlinkSync(path.join(project.root, 'web/index.html'));
    project.mkdir('web/index.html');
    project.run(['--force', '--', 'web'], 1);
    assert.equal(project.index(), homepageBefore);
});

test('homepage regeneration preserves all bytes outside the markers in every generation mode', t => {
    const project = fixture(t);
    const original = '<!DOCTYPE html>\r\n<h1>Personal welcome & contact</h1>\r\n' +
        '<ul>\r\n  <!-- DYNAMIC_LINKS_START -->\t\r\nold links\r\n' +
        '  <!-- DYNAMIC_LINKS_END -->\t\r\n</ul>\r\n<footer>Keep this exact layout</footer>';
    project.write('dh/index.html', original);
    project.mkdir('dh/folder & \u017c');
    project.write('dh/file.txt', 'List files as well as directories');
    const expected = homepageParts(original);
    for (const args of [['dh'], ['--recursive'], ['--force', 'dh'], ['--new', 'dh/web/new/child']]) {
        project.run(args);
        const actual = homepageParts(project.index('dh'));
        assert.equal(actual.before, expected.before);
        assert.equal(actual.after, expected.after);
        assert.ok(actual.links.includes(`href="./${encoded('folder & \u017c')}/"`));
        assert.ok(actual.links.includes('file.txt'));
        assert.ok(!actual.links.includes('old links'));
    }
});

test('missing, duplicate, inline or reversed homepage markers are errors even with --force', t => {
    const start = '<!-- DYNAMIC_LINKS_START -->';
    const end = '<!-- DYNAMIC_LINKS_END -->';
    for (const html of [
        '<h1>Keep this page</h1>',
        `${end}\n${start}\n`,
        `${start}\n`,
        `${end}\n`,
        `${start}\n${start}\n${end}\n`,
        `${start}\n${end}\n${end}\n`,
        `<ul>${start}\n${end}</ul>\n`
    ]) {
        const project = fixture(t);
        project.write('dh/index.html', html);
        for (const args of [['--recursive'], ['--recursive', '--force'], ['--new', 'dh/web/new']]) {
            const result = project.run(args, 1);
            assert.match(result.stderr, /DYNAMIC_LINKS/);
            assert.equal(project.index('dh'), html);
            assert.ok(!fs.existsSync(path.join(project.root, 'dh/web/index.html')));
            assert.ok(!fs.existsSync(path.join(project.root, 'dh/web/new')));
        }
    }
    const project = fixture(t);
    fs.unlinkSync(path.join(project.root, 'dh/index.html'));
    project.run(['--recursive', '--force'], 1);
    assert.ok(!fs.existsSync(path.join(project.root, 'dh/index.html')));
    assert.ok(!fs.existsSync(path.join(project.root, 'web/index.html')));
});

test('.noindex preserves entire websites and descendants, including with --force', t => {
    const project = fixture(t);
    const protectedPath = 'web/laby/projekt';
    project.mkdir(`${protectedPath}/assets/sub`);
    project.mkdir('web/laby/projekt-copy');
    project.write(`${protectedPath}/.noindex`, '');
    project.write(`${protectedPath}/index.html`, '<h1>Nursing website</h1>');
    project.write(`${protectedPath}/assets/index.html`, '<p>Custom asset page</p>');
    const before = project.index(protectedPath);
    const childBefore = project.index(`${protectedPath}/assets`);
    const modifiedBefore = fs.statSync(path.join(project.root, protectedPath, 'index.html')).mtimeMs;
    for (const args of [['--recursive'], ['--recursive', '--force']]) {
        project.run(args);
        assert.equal(project.index(protectedPath), before);
        assert.equal(project.index(`${protectedPath}/assets`), childBefore);
        assert.equal(fs.statSync(path.join(project.root, protectedPath, 'index.html')).mtimeMs, modifiedBefore);
        assert.ok(!fs.existsSync(path.join(project.root, protectedPath, 'assets/sub/index.html')));
        assert.ok(entryLinks(project.index('web/laby')).includes('./projekt/'));
        assert.ok(project.index('web/laby/projekt-copy').includes('<h1>~25_dawid/web/laby/projekt-copy/</h1>'));
    }
    project.run(['--force', '--', protectedPath], 1);
    project.run(['--', `${protectedPath}/assets`], 1);
    project.run(['--new', `${protectedPath}/new`], 1);
    project.run(['--recursive', '--force', '--', `${protectedPath}/assets`]);
    assert.equal(project.index(`${protectedPath}/assets`), childBefore);
    assert.ok(!fs.existsSync(path.join(project.root, protectedPath, 'new')));
});

test('repeatable --exclude uses literal normalized subtree paths and keeps parent links', t => {
    const project = fixture(t);
    const first = 'web/site [a] \u017c';
    const second = 'web/second';
    for (const directory of [first, second]) {
        project.mkdir(`${directory}/child`);
        project.write(`${directory}/index.html`, `Original ${directory}`);
    }
    project.mkdir(`${first}-copy`);
    const args = ['--exclude', `./${first}/`, '--exclude', path.join(project.root, second)];
    project.run(['--recursive', '--force', ...args]);
    for (const directory of [first, second]) {
        assert.equal(project.index(directory), `Original ${directory}`);
        assert.ok(!fs.existsSync(path.join(project.root, directory, 'child/index.html')));
        assert.ok(entryLinks(project.index('web')).includes(`./${encoded(path.basename(directory))}/`));
    }
    assert.ok(project.index(`${first}-copy`).includes('Generated by scripts/reindex.sh'));
    project.run(['--recursive', ...args, '--', `${first}/child`]);
    project.run(['--force', ...args, '--', `${first}/child`], 1);
    project.run(['--new', ...args, '--', `${first}/new`], 1);
    assert.ok(!fs.existsSync(path.join(project.root, first, 'new')));
    project.run(['--recursive', '--exclude', '.', '--exclude', 'future-directory']);
});

test('excluding the entire tree is an explicit no-op, not an array or validation failure', t => {
    const project = fixture(t);
    const before = project.index();
    const result = project.run(['--recursive', '--exclude', '.']);
    assert.match(result.stdout, /Brak katalogow do aktualizacji/);
    assert.equal(project.index(), before);
    assert.ok(!fs.existsSync(path.join(project.root, 'web/index.html')));
    project.write('.noindex', '');
    project.run(['--recursive', '--force']);
    project.run(['--recursive', '--', 'web']);
    project.run(['--force'], 1);
    assert.equal(project.index(), before);
    assert.ok(!fs.existsSync(path.join(project.root, 'web/index.html')));
});

test('human file sizes use decimal B, KB, MB and GB at the exact unit thresholds', t => {
    const project = fixture(t);
    const sizes = [
        [0, '0 B'], [999, '999 B'], [1000, '1.0 KB'], [1024, '1.0 KB'],
        [1536, '1.5 KB'], [999949, '999.9 KB'], [999950, '1.0 MB'],
        [1000000, '1.0 MB'], [1000000000, '1.0 GB']
    ];
    for (const [bytes] of sizes) {
        const file = path.join(project.root, 'web', `${bytes}.bin`);
        fs.writeFileSync(file, '');
        fs.truncateSync(file, bytes);
    }
    project.run(['--', 'web']);
    const html = project.index('web');
    for (const [bytes, display] of sizes) {
        assert.ok(html.includes(`data-bytes="${bytes}" title="${bytes} B">${display}</span>`), `${bytes}: ${display}`);
    }
    assert.doesNotMatch(html, /\b[KMGTPE]iB\b/);
});

test('preserved pages share the theme, filter and favicon; VS Code tasks use process arguments', () => {
    for (const relative of ['index.html', 'dh/index.html', 'dh/projekty/index.html']) {
        const html = fs.readFileSync(path.join(sourceRoot, relative), 'utf8');
        assert.ok(html.includes(favicon));
        assert.ok(html.includes('<body class="dark-theme">'));
        assert.ok(html.includes('<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">'));
        const authorUrl = html.match(/<link rel="author" type="text\/plain" href="([^"]+)">/)[1];
        assert.equal(path.resolve(sourceRoot, path.dirname(relative), authorUrl), path.join(sourceRoot, 'humans.txt'));
        assert.ok(html.includes('id="dir-filter"') && html.includes('id="dir-list"'));
        assert.equal(entryLinks(html)[0], '../');
        assert.equal((html.match(/<svg class="theme-icon"/g) || []).length, 2);
    }
    assert.ok(!fs.existsSync(path.join(sourceRoot, 'dh/o-mnie.html')));
    const homepage = fs.readFileSync(path.join(sourceRoot, 'dh/index.html'), 'utf8');
    for (const text of [
        'Franciszek Dawid', 'Student Elektronicznego Przetwarzania Informacji (EPI)',
        'franciszek.dawid@student.uj.edu.pl', 'https://github.com/sh3kda',
        '<code>bash scripts/reindex.sh --recursive</code>',
        '<title>~25_dawid/dh/</title>'
    ]) {
        assert.ok(homepage.includes(text), text);
    }
    homepageParts(homepage);
    assert.ok(fs.existsSync(path.join(sourceRoot, 'dh/web/laby/projekt/.noindex')));
    const personal = homepageParts(homepage);
    assert.deepEqual([...`${personal.before}${personal.after}`.matchAll(/<a [^>]*href="([^"]+)"/g)]
        .map(match => match[1]), ['../', '../',
        'https://www.linkedin.com/in/franciszek-dawid/', 'https://github.com/sh3kda']);
    const config = JSON.parse(fs.readFileSync(path.join(sourceRoot, '.vscode/tasks.json'), 'utf8'));
    const build = config.tasks.find(task => task.group?.isDefault);
    assert.ok(build.args.includes('--recursive'));
    const create = config.tasks.find(task => task.args.includes('--new'));
    assert.deepEqual(create.args.slice(-2), ['--', '${input:newFolder}']);
    assert.ok(config.tasks.every(task => task.type === 'process' && Array.isArray(task.args)));
});

test('portfolio is the protected projects landing page and survives scheduled reindexing', t => {
    const project = fixture(t);
    project.mkdir('dh/projekty');
    for (const file of ['index.html', '.noindex']) {
        fs.copyFileSync(path.join(sourceRoot, 'dh/projekty', file), path.join(project.root, 'dh/projekty', file));
    }
    const original = project.index('dh/projekty');
    assert.ok(original.includes('czyPrzejade'));
    assert.ok(!fs.existsSync(path.join(sourceRoot, 'dh/projekty/portfolio.html')));
    assert.ok(!original.includes('portfolio.html'));
    assert.equal((original.match(/href="\.\.\/"/g) || []).length, 2);
    for (const args of [['--recursive'], ['--recursive', '--force']]) {
        project.run(args);
        assert.equal(project.index('dh/projekty'), original);
        assert.ok(entryLinks(project.index('dh')).includes('./projekty/'));
    }
});

test('portfolio describes all current projects in Polish and links to existing materials', () => {
    const directory = path.join(sourceRoot, 'dh/projekty');
    const html = fs.readFileSync(path.join(directory, 'index.html'), 'utf8');
    const cards = [...html.matchAll(/<li class="project-item"[^>]*data-entry[^>]*>([\s\S]*?)<\/li>/g)]
        .map(match => match[1]);
    assert.equal(cards.length, 5);
    for (const name of ['czyPrzejade', 'En Passant', 'Reign of Abaddon', 'Retinere', 'ZaWah\u0119']) {
        assert.ok(cards.some(card => card.includes(`<div class="project-title">${name} `)), name);
    }
    for (const card of cards) {
        assert.match(card, /class="entry-name"/);
        assert.match(card, /class="project-tags"/);
        assert.match(card, /<p>[^<]+<\/p>/);
        assert.match(card, /class="project-links"/);
    }
    const localLinks = [...html.matchAll(/href="(\.\/[^"]+)"/g)].map(match => match[1]);
    assert.equal(localLinks.length, 5);
    for (const url of localLinks) {
        assert.ok(fs.statSync(path.resolve(directory, decodeURIComponent(url))).isFile(), url);
    }
    for (const folder of ['En-Passant', 'Reign-of-Abaddon', 'Retinere', 'ZaWahe']) {
        assert.ok(localLinks.some(url => url.startsWith(`./${folder}/`)), folder);
    }
    assert.ok(html.includes('https://www.figma.com/proto/FmbcSzlkKzczkZw2BL6p0S/'));
});

test('only czyPrzejade has a filled accessible SVG star directly right of its title', () => {
    const html = fs.readFileSync(path.join(sourceRoot, 'dh/projekty/index.html'), 'utf8');
    assert.equal((html.match(/class="project-favorite"/g) || []).length, 1);
    assert.match(html, /<div class="project-title">czyPrzejade [^<]+<\/div>\s*<svg class="project-favorite" width="28" height="28" viewBox="0 0 24 24" role="img" aria-label="Ulubiony projekt" focusable="false">[\s\S]*?<title>Ulubiony projekt<\/title>[\s\S]*?<\/svg>/);
    assert.ok(html.includes('href="../web/media/index.css?v=favorite-3"'));
    const css = fs.readFileSync(path.join(sourceRoot, 'dh/web/media/index.css'), 'utf8');
    assert.match(css, /\.project-favorite \{[^}]*color:\s*var\(--link-color\)/);
    assert.match(css, /\.project-favorite \{[^}]*width: 28px;[^}]*height: 28px;/);
    assert.match(css, /\.project-favorite \{[^}]*fill: currentColor;[^}]*fill-opacity: 1;/);
    assert.match(css, /\.project-heading \{[^}]*display: inline-grid;[^}]*grid-template-columns: minmax\(0, 1fr\) 28px;/);
});

test('crawler policy stays scoped to this user and authorship names original work', () => {
    const robots = fs.readFileSync(path.join(sourceRoot, 'robots.txt'), 'utf8');
    const directives = robots.split('\n').filter(line => line && !line.startsWith('#'));
    assert.deepEqual(directives, ['User-agent: *', 'Disallow: /~25_dawid/']);
    const headers = fs.readFileSync(path.join(sourceRoot, '.htaccess'), 'utf8');
    assert.ok(headers.includes('Header always set X-Robots-Tag "noindex, nofollow, noarchive, nosnippet"'));
    const humans = fs.readFileSync(path.join(sourceRoot, 'humans.txt'), 'utf8');
    assert.ok(humans.includes("Franciszek 'sh3kda' Dawid"));
    assert.ok(humans.includes('Third-party materials belong to their respective authors.'));
});

test('root logo preserves ASCII art and link color across regeneration', t => {
    const project = fixture(t);
    project.run(['--recursive']);
    const logo = project.index().match(/<pre class="wierzba-logo"[^>]*>([\s\S]*?)<\/pre>/);
    assert.ok(logo);
    assert.equal(logo[1].split('\n').length, 7);
    assert.ok(logo[1].includes('\\_/\\_/ |_|\\___|_|  /___||_.__/ \\__,_|'));
    assert.ok(logo[1].includes('administrator: admin@epi.uj.edu.pl'));
    assert.ok(!project.index('web').includes('wierzba-logo'));
    const before = project.index();
    project.run(['--recursive']);
    assert.equal(project.index(), before);
    const css = fs.readFileSync(path.join(sourceRoot, 'dh/web/media/index.css'), 'utf8');
    const styles = css.match(/\.wierzba-logo \{([^}]+)\}/)[1];
    assert.match(styles, /color:\s*var\(--link-color\)/);
    assert.match(styles, /white-space:\s*pre;/);
    assert.match(styles, /overflow-x:\s*auto;/);
});

test('README uses UTF-8 text responses without changing other file types', () => {
    const config = fs.readFileSync(path.join(sourceRoot, '.htaccess'), 'utf8');
    assert.match(config, /<Files "README\.md">\s+ForceType text\/plain\s+AddDefaultCharset UTF-8\s+<\/Files>/);
    const bytes = fs.readFileSync(path.join(sourceRoot, 'README.md'));
    const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
    assert.ok(text.includes('własny kod'));
    assert.ok(text.includes('odśwież indeksy'));
});
test('parent root is bootstrapped and all lists follow physical additions and deletions', t => {
    const project = fixture(t);
    fs.unlinkSync(path.join(project.root, 'index.html'));
    project.mkdir('another-section');
    project.mkdir('dh/lesson');
    project.write('dh/notes.txt', 'abc');
    project.run(['--recursive']);
    assert.deepEqual(entryLinks(project.index()), ['../', './another-section/', './dh/', './web/']);
    assert.ok(entryLinks(project.index('dh')).includes('./lesson/'));
    assert.ok(entryLinks(project.index('dh')).includes('./notes.txt'));
    fs.unlinkSync(path.join(project.root, 'dh/notes.txt'));
    project.run(['--new', 'dh/web/new/child']);
    assert.ok(!entryLinks(project.index('dh')).includes('./notes.txt'));
    assert.ok(project.index('dh/web/new/child').includes('<title>~25_dawid/dh/web/new/child/</title>'));
    assert.ok(project.index().includes('~/public_html/'));
});

test('link colors have readable normal and hover contrast in both themes', () => {
    const css = fs.readFileSync(path.join(sourceRoot, 'dh/web/media/index.css'), 'utf8');
    function luminance(hex) {
        return hex.match(/[0-9a-f]{2}/gi).map(value => {
            const channel = parseInt(value, 16) / 255;
            return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
        }).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
    }
    for (const selector of [':root', 'body.dark-theme']) {
        const block = css.slice(css.indexOf(`${selector} {`)).split('}')[0];
        const bg = luminance(block.match(/--bg-color: (#[0-9a-f]{6})/)[1]);
        for (const variable of ['link-color', 'link-hover']) {
            const color = block.match(new RegExp(`--${variable}: (#[0-9a-f]{6})`))[1];
            const fg = luminance(color);
            assert.ok((Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05) >= 4.5);
            if (selector === 'body.dark-theme' && variable === 'link-color') {
                assert.equal(color, '#34d399');
            }
        }
    }
});

test('rsync updates local websites while keeping indexing protection and server-only files', t => {
    const project = fixture(t);
    const destination = path.join(project.root, '.receiver');
    fs.mkdirSync(path.join(destination, 'dh/scripts'), { recursive: true });
    fs.mkdirSync(path.join(destination, 'dh/web/laby/projekt'), { recursive: true });
    fs.mkdirSync(path.join(destination, 'dh/bd2'), { recursive: true });
    fs.mkdirSync(path.join(destination, 'dh/projekty'), { recursive: true });
    for (const file of ['dh/list.php', 'dh/index.php', 'dh/scripts/reindex.sh', 'dh/.DS_Store', 'dh/projekty/portfolio.html']) {
        fs.writeFileSync(path.join(destination, file), 'obsolete');
    }
    for (const file of ['dh/bd2/assignment.php', 'dh/web/laby/projekt/server-only.txt',
        'dh/remote-only.txt', 'dh/projekty/server-only.txt']) {
        fs.writeFileSync(path.join(destination, file), 'preserve');
    }
    project.mkdir('dh/web/laby/projekt');
    project.write('.env', 'private fixture');
    project.write('dh/web/laby/projekt/.env.local', 'private fixture');
    const websiteFiles = {
        'index.html': '<h1>Updated nursing website</h1>',
        'styles.css': 'body { color: green; }',
        'script.js': 'console.log("updated website");',
        '.noindex': '# Protect from index generation.'
    };
    for (const [file, content] of Object.entries(websiteFiles)) {
        fs.writeFileSync(path.join(destination, 'dh/web/laby/projekt', file), 'old content');
        project.write(`dh/web/laby/projekt/${file}`, content);
    }
    project.mkdir('dh/projekty');
    project.write('dh/projekty/index.html', 'portfolio');
    project.write('dh/projekty/.noindex', '');
    const result = spawnSync('rsync', [
        '-rc', '--delete-after', '--exclude=/.receiver/',
        `--filter=merge ${path.join(sourceRoot, 'scripts/deploy.filters')}`,
        `${project.root}/`, `${destination}/`
    ], { encoding: 'utf8', timeout: 30000 });
    assert.ifError(result.error);
    assert.equal(result.status, 0, result.stdout + result.stderr);
    for (const file of ['dh/list.php', 'dh/index.php', 'dh/scripts/reindex.sh', 'dh/.DS_Store', 'dh/projekty/portfolio.html']) {
        assert.ok(!fs.existsSync(path.join(destination, file)), file);
    }
    for (const file of ['dh/bd2/assignment.php', 'dh/web/laby/projekt/server-only.txt',
        'dh/remote-only.txt', 'dh/projekty/server-only.txt']) {
        assert.equal(fs.readFileSync(path.join(destination, file), 'utf8'), 'preserve');
    }
    assert.ok(fs.existsSync(path.join(destination, 'scripts/reindex.sh')));
    assert.ok(!fs.existsSync(path.join(destination, '.env')));
    assert.ok(!fs.existsSync(path.join(destination, 'dh/web/laby/projekt/.env.local')));
    assert.equal(fs.readFileSync(path.join(destination, 'dh/projekty/index.html'), 'utf8'), 'portfolio');
    assert.ok(fs.existsSync(path.join(destination, 'dh/projekty/.noindex')));
    const reindex = spawnSync('bash', [
        path.join(destination, 'scripts/reindex.sh'), '--recursive'
    ], { encoding: 'utf8', timeout: 30000 });
    assert.ifError(reindex.error);
    assert.equal(reindex.status, 0, reindex.stdout + reindex.stderr);
    for (const [file, content] of Object.entries(websiteFiles)) {
        assert.equal(fs.readFileSync(path.join(destination, 'dh/web/laby/projekt', file), 'utf8'), content);
    }
});
