#include <iostream>
#include <vector>

using namespace std;

int main() {
    vector<int> liczby;
    int liczba;

    cout << "Podawaj liczby (wpisz tekst aby zakonczyc): " << endl;
    while(cin >> liczba) {
        liczby.push_back(liczba);
    }

    cout << "wpisane liczby: ";
    for(int i = 0; i < liczby.size(); i++) {
        cout << liczby[i] << " ";
    }
    cout << endl;

    int i = 0;
    int j = liczby.size() - 1;
    while(i < j) {
        int temp = liczby[i];
        liczby[i] = liczby[j];
        liczby[j] = temp;
        i++;
        j--;
    }

    cout << "po odwroceniu: ";
    for(int i = 0; i < liczby.size(); i++) {
        cout << liczby[i] << " ";
    }
    cout << endl;

    return 0;
}