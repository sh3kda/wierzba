#include <iostream>
#include <string>
using namespace std;
int main() {
    string login;
    cout << "Witaj w naszej bazie logowania." << endl;
    cout << "Podaj swoj login (admin/user): ";
    cin >> login;

    while (login != "admin" && login != "user") {
        cout << "Nieznany login. Sprobuj ponownie: ";
        cin >> login;
    }

    string poprawneHasloAdmin = "admin123";
    string poprawneHasloUser = "user123"; // zapory nie do przejscia
    string poprawneHaslo = (login == "admin") ? poprawneHasloAdmin : poprawneHasloUser;

    int proby = 3;
    string haslo;
    cout << "Podaj haslo: ";
    while (proby > 0) {
        cin >> haslo;
        if (haslo == poprawneHaslo) break;
        proby--;
        if (proby > 0) {
            cout << "Nieprawidlowe haslo. Pozostało: " << proby << " prob. Sprobuj ponownie: ";
        }
    }

    if (haslo == poprawneHaslo) {
        cout << "Zalogowano pomyślnie jako " << login << "." << endl;
    } else {
        cout << "Zbyt wiele nieudanych prób. Dostęp zablokowany." << endl;
    }

    return 0;
}