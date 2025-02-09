import {
	collection,
	query,
	getDocs,
	where,
} from "firebase/firestore";

import { db } from "@/src/lib/firebase/clientApp";

export async function getDesignsForUser(database = db, userId) {
    let q = query(collection(database, "designs"));

    q = query(q, where("userId", "==", userId))

    const results = await getDocs(q);
    return results.docs.map(doc => {
        return {
            id: doc.id,
            ...doc.data(),
            timestamp: doc.data().timestamp.toDate(),
        };
    });
}