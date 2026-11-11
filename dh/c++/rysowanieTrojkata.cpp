#include <iostream>
using namespace std;

int main() {

    int wysokosc = 0;
    int opcja = 0;

    cout << "Siema, narysujemy trojkat z gwiadzek, podasz mi jak ma byc duzy, a ja zrobie reszte." << endl;
    cout << "Podaj wysokosc trojkata: ";
    cin >> wysokosc;
    
    cout << "Teraz w ktora strone go stawiamy, wybierz opcje: " << endl;

    cout << "1 - jak piramida, od gory w dol coraz szerzej" << endl;
    cout << "2 - trojkat na glowie, od gory w dol coraz wezej" << endl;

    cout << "Wybor: "; 
    cin >> opcja;

    while (opcja != 1 && opcja != 2) {

        cout << "Niepoprawna opcja!" << endl;

        cout << "Wybierz opcje (1 v 2): " << endl;
        cout << "1 - trojkat piramida" << endl;
        cout << "2 - trojkat na glowie" << endl;
        
        cout << "Wybor: ";
        cin >> opcja;

    }

    if (opcja == 2) {
        for (int i = wysokosc; i >= 1; i--) { 
            for (int j = 1; j <= wysokosc - i; j++) {
                cout << " ";
            }
            for (int k = 1; k <= 2 * i - 1; k++) {
                cout << "*";
            }
            cout << endl;
        }
    } else if (opcja == 1) {
        for (int i = 1; i <= wysokosc; i++) {
            for (int j = 1; j <= wysokosc - i; j++) {
                cout << " ";
            }
            for (int k = 1; k <= 2 * i - 1; k++) {
                cout << "*";
            }
            cout << endl;
        }
    }

    else { cout << "Blad podanej wartosci, sprobuj ponownie." << endl; }

    cout << "Podoba sie? :D" << endl;

    return 0;
}