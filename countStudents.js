// Import Firebase Admin SDK
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
const serviceAccount = require("./teacher-escuela-firebase-adminsdk-35q2o-edebf7096d.json"); // Файл с данными для доступа к тестовой БД

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 1. Подсчет учеников с параметром student: true
async function countStudents() {
    try {
        const studentsRef = db.collection("students");
        const querySnapshot = await studentsRef.where("student", "==", true).get();

        console.log("Number of students with student = true:", querySnapshot.size);
    } catch (error) {
        console.error("Error counting students:", error);
    }
}

// 2. Подсчет учеников с параметром student: true и наличием подколлекции notes
async function countStudentsWithNotes() {
    try {
        const studentsRef = db.collection("students");
        const querySnapshot = await studentsRef.where("student", "==", true).get();

        let count = 0;
        for (const doc of querySnapshot.docs) {
            const notesRef = db.collection("students").doc(doc.id).collection("notes");
            const notesSnapshot = await notesRef.limit(1).get(); // проверка наличия подколлекции notes
            if (!notesSnapshot.empty) {
                count++;
            }
        }

        console.log("Number of students with student = true and notes subcollection:", count);
    } catch (error) {
        console.error("Error counting students with notes:", error);
    }
}

// 3. Подсчет количества заметок у всех всех учеников
async function countAllNotes() {
    try {
        const studentsRef = db.collection("students");
        const studentsSnapshot = await studentsRef.get();

        let totalNotes = 0;
        for (const studentDoc of studentsSnapshot.docs) {
            const notesRef = db.collection("students").doc(studentDoc.id).collection("notes");
            const notesSnapshot = await notesRef.get();
            totalNotes += notesSnapshot.size;
        }

        console.log("Total number of notes in all students' notes subcollections:", totalNotes);
    } catch (error) {
        console.error("Error counting notes:", error);
    }
}

// Запуск всех функций
async function main() {
    await countStudents();
    await countStudentsWithNotes();
    await countAllNotes();
}

main();
