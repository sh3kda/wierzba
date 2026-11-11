#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
#include <map>
using namespace std;

int wczytajStudentow() {
    int liczbaStudentow = 0;
    cout << "Podaj liczbe studentow: ";
    cin >> liczbaStudentow;
    return liczbaStudentow;
}

string nazwiskaStudentow(){
    string nazwisko = "nieznane";
    cout << "Podaj nazwisko studenta: ";
    cin >> nazwisko;
    return nazwisko;
}

bool czyPodawacNazwiska() {
    char wybor;
    cout << "Czy chcesz podawac nazwiska studentow? (t/n): ";
    cin >> wybor;

   while (wybor != 't' && wybor != 'n') {
        cout << "Nieprawidlowy wybor. Prosze wpisz 't' lub 'n': ";
        cin >> wybor;
   }

   switch (wybor) {
    case 't':
        return true;
    case 'n':
        return false;
    default:
        cout << "Nieprawidlowy wybor. Domyslnie ustawiono na 'nie'." << endl;
        return false;
   }
    }

int wczytajOcene() {
    int ocena = 0;
    cout << "Podaj ocene studenta w punktach (0-100): ";
    cin >> ocena;
    while (ocena < 0 || ocena > 100) {
        cout << "Nieprawidlowa ocena. Prosze podaj ocene w punktach (0-100): ";
        cin >> ocena;
    }
    return ocena;
}

double przelicznikOceny(int ocena) {
    if (ocena >= 90) {
        return 5.0;
    } else if (ocena >= 80) {
        return 4.5;
    } else if (ocena >= 70) {
        return 4.0;
    } else if (ocena >= 60) {
        return 3.5;
    } else if (ocena >= 50) {
        return 3.0;
    } else {
        return 2.0;
    }
}


bool czyZdane(int ocena) {
    if (ocena >= 50) {
        return true; // zdane
    } else {
        return false; // niezdane
    }
}

double obliczSrednia(int sumaOcen, int liczbaStudentow) {
    if (liczbaStudentow == 0) {
        return 0.0;
    }
    return static_cast<double>(sumaOcen) / liczbaStudentow;
}


double najczestszaOcena(vector<double> ocenyPrzeliczone) {
    map<double, int> licznik;
    for (double o : ocenyPrzeliczone) licznik[o]++;
    double najczestsza = 0.0;
    int maxCount = 0;
    for (auto wpis : licznik) {
        if (wpis.second > maxCount) {
            maxCount = wpis.second;
            najczestsza = wpis.first;
        }
    }
    return najczestsza;
}

double obliczSredniaPrzeliczona(vector<double> ocenyPrzeliczone) {
    if (ocenyPrzeliczone.empty()) return 0.0;
    double suma = 0.0;
    for (double o : ocenyPrzeliczone) suma += o;
    return suma / ocenyPrzeliczone.size();
}

void rysujLinie() {
    cout << "- - - - - - - - - - - - - - - - -" << endl;
}

int main() {

    rysujLinie();
    cout << "   SYSTEM OCENIANIA STUDENTOW" << endl;
    rysujLinie();
    cout << endl;

    int liczbaStudentow = wczytajStudentow();
    bool podawacNazwiska = czyPodawacNazwiska();
    cout << endl;

    int sumaOcen = 0;
    int najwyzszy = -1;
    int najnizszy = 101;
    int liczbaZdanych = 0;
    vector<int> oceny;
    vector<double> ocenyPrzeliczone;
    vector<string> nazwiska;

    for (int i = 0; i < liczbaStudentow; i++) {
        rysujLinie();
        cout << "  Student " << (i + 1) << " z " << liczbaStudentow << endl;
        rysujLinie();

        string nazwisko = "nieznane";
        if (podawacNazwiska == true) {
            nazwisko = nazwiskaStudentow();
        }

        int ocena = wczytajOcene();
        double ocenaPrzeliczona = przelicznikOceny(ocena);
        bool zdany = czyZdane(ocena);

        sumaOcen += ocena;
        if (ocena > najwyzszy) najwyzszy = ocena;
        if (ocena < najnizszy) najnizszy = ocena;
        if (zdany) liczbaZdanych++;
        oceny.push_back(ocena);
        ocenyPrzeliczone.push_back(ocenaPrzeliczona);
        nazwiska.push_back(nazwisko);

        cout << "Punkty: " << ocena << " / 100" << endl;
        cout << "Ocena: " << ocenaPrzeliczona << endl;
        cout << "Status: " << (zdany ? "Zdany" : "Niezdany") << endl;
        cout << endl;
    }

    cout << "Czy chcesz zobaczyc podsumowanie wynikow? (t/n): ";
    char wybor;
    cin >> wybor;
    cout << endl;

    if (wybor == 't') {
        rysujLinie();
        cout << "         PODSUMOWANIE" << endl;
        rysujLinie();
        int liczbaNiezdanych = liczbaStudentow - liczbaZdanych;
        double procentZdanych = liczbaStudentow > 0 ? (100.0 * liczbaZdanych / liczbaStudentow) : 0.0;
        cout << "  Liczba studentow      : " << liczbaStudentow << endl;
        cout << "  Zdani                 : " << liczbaZdanych << "  (" << (int)procentZdanych << "%)" << endl;
        cout << "  Uwaleni               : " << liczbaNiezdanych << "  (" << (int)(100 - procentZdanych) << "%)" << endl;
        cout << "  Srednia punktow       : " << obliczSrednia(sumaOcen, liczbaStudentow) << " pkt" << endl;
        cout << "  Srednia ocen          : " << obliczSredniaPrzeliczona(ocenyPrzeliczone) << endl;
        cout << "  Najwyzszy wynik       : " << (najwyzszy >= 0 ? najwyzszy : 0) << " pkt" << endl;
        cout << "  Najnizszy wynik       : " << (najnizszy <= 100 ? najnizszy : 0) << " pkt" << endl;
        cout << "  Najpopularniejsza ocena: " << najczestszaOcena(ocenyPrzeliczone) << endl;
        rysujLinie();
        cout << "  Lista studentow:" << endl;
        rysujLinie();
        for (int i = 0; i < liczbaStudentow; i++) {
            cout << "  " << (i + 1) << ". " << nazwiska[i]
                 << " - " << oceny[i] << " pkt"
                 << "  ocena: " << przelicznikOceny(oceny[i])
                 << "  [" << (czyZdane(oceny[i]) ? "Zdany" : "Niezdany") << "]" << endl;
        }
        rysujLinie();
    } else {
        cout << "Dziekuje, do widzenia" << endl;
    }

    return 0;
}