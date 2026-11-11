#include <iostream>
using namespace std;

int main() {
    int rozmiar = 2;
    int ilosc = 0;
    int* liczby = new int[rozmiar];
    int opcja;

    do {
        cout << " - - - - - - Menu - - - - - - " << endl << endl;
        cout << "1 Dodaj liczbe" << endl;
        cout << "2 Wyswietl wszystkie liczby" << endl;
        cout << "3 Oblicz srednia wartosc" << endl;
        cout << "4 Wyjscie" << endl << endl;

        cout << "Wybierz opcje: ";
        cin >> opcja;

        cout << endl;

        if (opcja == 1) {
            int liczba;
            cout << "Podaj liczbe: ";
            cin >> liczba;
            cout << endl;

            if (ilosc == rozmiar) {
                int nowyRozmiar = rozmiar * 2;
                int* nowaTablica = new int[nowyRozmiar];
                
                for (int i = 0; i < ilosc; i++) {
                    nowaTablica[i] = liczby[i];
                }
                
                delete[] liczby;
                liczby = nowaTablica;
                rozmiar = nowyRozmiar;
            }

            liczby[ilosc] = liczba;
            ilosc++;

            cout << "Liczba zostala dodana. Ju hu" << endl << endl;
            
        } else if (opcja == 2) {
            for (int i = 0; i < ilosc; i++) {
                cout << i+1 << "." << liczby[i] << endl;
            }
            if (ilosc == 0) cout << "Brak liczb, nie mam czego wyswietlac!" << endl << endl; 
            cout << endl;
            
        } else if (opcja == 3) {
            if (ilosc == 0) {
                cout << "Brak informacji" << endl;

            } else {
                double suma = 0;
                for (int i = 0; i < ilosc; i++) {
                    suma += liczby[i];
                }
                cout << "Srednia: " << suma / ilosc << endl << endl;
            }
        }
    } while (opcja != 4);

    cout << "Na razie :)" << endl;

    delete[] liczby;
    return 0;
}