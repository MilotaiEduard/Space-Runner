import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";

import { db } from './firebase.js';

const PLAYERS_COLLECTION = 'players';

function validatePlayerName(playerName) {
    if (typeof playerName !== 'string') {
        throw new Error('Numele jucătorului nu este valid.');
    }

    const trimmedName = playerName.trim();

    if (trimmedName.length < 3) {
        throw new Error(
            'Numele trebuie să conțină cel puțin 3 caractere.'
        );
    }

    if (trimmedName.length > 12) {
        throw new Error(
            'Numele poate conține maximum 12 caractere.'
        );
    }

    if (!/^[a-zA-Z0-9_]+$/.test(trimmedName)) {
        throw new Error(
            'Numele poate conține doar litere, cifre și underscore.'
        );
    }

    return trimmedName;
}

function normalizePlayerName(playerName) {
    return playerName
        .trim()
        .toLowerCase();
}

function validateScore(score) {
    if (
        !Number.isFinite(score) ||
        score < 0
    ) {
        throw new Error('Scorul nu este valid.');
    }

    return Math.floor(score);
}

export async function savePlayerScore(
    playerName,
    score
) {
    const validPlayerName =
        validatePlayerName(playerName);

    const normalizedName =
        normalizePlayerName(validPlayerName);

    const validScore =
        validateScore(score);

    const playerReference = doc(
        db,
        PLAYERS_COLLECTION,
        normalizedName
    );

    await runTransaction(
        db,
        async (transaction) => {
            const playerSnapshot =
                await transaction.get(
                    playerReference
                );

            if (!playerSnapshot.exists()) {
                transaction.set(
                    playerReference,
                    {
                        playerName: validPlayerName,
                        normalizedName,
                        bestScore: validScore,
                        createdAt: serverTimestamp(),
                        updatedAt: serverTimestamp()
                    }
                );

                return;
            }

            const playerData =
                playerSnapshot.data();

            const currentBestScore =
                playerData.bestScore ?? 0;

            if (validScore > currentBestScore) {
                transaction.update(
                    playerReference,
                    {
                        playerName: validPlayerName,
                        bestScore: validScore,
                        updatedAt: serverTimestamp()
                    }
                );
            }
        }
    );
}

export async function getLeaderboard(
    maxResults = 10
) {
    const validLimit = Math.min(
        Math.max(
            Math.floor(maxResults),
            1
        ),
        100
    );

    const leaderboardQuery = query(
        collection(db, PLAYERS_COLLECTION),
        orderBy('bestScore', 'desc'),
        limit(validLimit)
    );

    const snapshot = await getDocs(
        leaderboardQuery
    );

    return snapshot.docs.map(
        (playerDocument, index) => {
            const playerData =
                playerDocument.data();

            return {
                id: playerDocument.id,
                position: index + 1,
                playerName:
                    playerData.playerName ?? 'Player',
                bestScore:
                    playerData.bestScore ?? 0
            };
        }
    );
}