// eventService.js
import { db } from '../config/firebase';
import { getDatabase, ref, get, child, remove } from 'firebase/database';

export async function deleteExpiredEvents(userUid) {
  const userRef = ref(db, `Users/${userUid}/Organizations`);

  try {
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      const dataArray = Object.values(data);

      for (const organization of dataArray) {
        const ongoingEventsRef = ref(db, `Organizations/${organization}/OngoingEvents`);
        const ongoingEventsSnapshot = await get(ongoingEventsRef);

        if (ongoingEventsSnapshot.exists()) {
          const ongoingEvents = ongoingEventsSnapshot.val();
          const eventIds = Object.values(ongoingEvents);

          for (const eventId of eventIds) {
            const eventRef = ref(db, `Events/${eventId}`);
            const eventSnapshot = await get(eventRef);

            if (eventSnapshot.exists()) {
              const event = eventSnapshot.val();
              const endDate = new Date(event.endDate);
              const endTime = new Date(event.endTime);
              endDate.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());

              const currentDate = new Date();

              if (currentDate > endDate) {
                await remove(eventRef);
                console.log(`Event ${eventId} deleted.`);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error deleting expired events:', error);
  }
}
