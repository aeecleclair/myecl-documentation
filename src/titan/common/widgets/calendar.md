---
title: Calendar
order: 4
category:
  - Guide
---

#### Calendar

**Description :**

Un calendrier, avec les boutons de navigation pour le web, et un popup pour afficher les détails au clic sur un item du calendrier.

**Utilisation :**

Utilisation très rare (3 fois).
A utiliser quand on veux mettre en place un calendrier.

**Paramètres :**

- `dataSource (CalendarDataSource<Object?>)` _obligatoire_: Les objetx à afficher sur le calendrier
- `items (AsyncValue<List<Object?>>)` _obligatoire_ : Le provider de la liste des objets à afficher sur le calendrier

**Exemple :**
_booking/.../admin_page.dart_

```dart
// Génération des objets du calendrier
List<Appointment> appointments = <Appointment>[];
	confirmedBookings.map((e) {
		if (e.recurrenceRule != "") {
      final dates = getDateInRecurrence(e.recurrenceRule, e.start);
      dates.map((data) {
        appointments.add(Appointment(
          startTime: combineDate(data, e.start),
          endTime: combineDate(data, e.end),
          subject: '${e.room.name} - ${e.reason}',
          isAllDay: false,
          startTimeZone: "Europe/Paris",
          endTimeZone: "Europe/Paris",
          notes: e.note,
          color: generateColor(e.room.name),
        ));
      }).toList();
    } else {
      appointments.add(Appointment(
        startTime: e.start,
        endTime: e.end,
        subject: '${e.room.name} - ${e.reason}',
        isAllDay: false,
        startTimeZone: "Europe/Paris",
        endTimeZone: "Europe/Paris",
        notes: e.note,
        color: generateColor(e.room.name),
      ));
    }
 }).toList();

...

SizedBox(
		height: MediaQuery.of(context).size.height - 380,
    child: Calendar(
		items: bookings,
		dataSource: AppointmentDataSource(appointments))),
```
