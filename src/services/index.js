import firebase from "firebase/app";
import "firebase/firestore";
import config from "../config";

const db = firebase.initializeApp(config).firestore();
let userId = "";
let editingMovie = {};

export function getEditMovie() {
  return editingMovie;
}

export function setEditMovie(movie) {
  editingMovie = movie;
}

export function getUserId() {
  return String(userId);
}

export async function findUser(userId) {
  const request = (await db
    .collection("users")
    .doc(String(userId))
    .get()).exists;

  return request;
}

export async function createUser(userId) {
  const lists = (await db
    .collection("users")
    .doc("default")
    .get()).data().lists;

  const movies = [];

  await db
    .collection("users")
    .doc(String(userId))
    .set({ lists, movies });
}

export function setUserId(id) {
  userId = id;
}

export async function getMovies() {
  const request = await db
    .collection("users")
    .doc(getUserId())
    .get();

  const response = request.data().movies;

  return response;
}

export async function getLists() {
  const request = await db
    .collection("users")
    .doc(getUserId())
    .get();

  const response = request.data().lists;

  return response;
}

export async function addMovie(movie) {
  const request = await db
    .collection("users")
    .doc(getUserId())
    .update({
      movies: firebase.firestore.FieldValue.arrayUnion(movie)
    });

  return request;
}

export async function deleteMovie(movie) {
  const del = await db
    .collection("users")
    .doc(getUserId())
    .update({
      movies: firebase.firestore.FieldValue.arrayRemove(movie)
    });

  return del;
}

export async function updateMovie(movie, moviePrev) {
  const userMovies = await db
    .collection("users")
    .doc(getUserId())
    .get();

  const movies = userMovies.get("movies").map(mov => {
    if (JSON.stringify(mov) === JSON.stringify(moviePrev)) return movie;
    else return mov;
  });

  const listsResp = await db
    .collection("users")
    .doc(getUserId())
    .get();

  const lists = listsResp.data().lists;

  const request = await db
    .collection("users")
    .doc(getUserId())
    .set({
      lists,
      movies
    });

  return request;
}

export default { getMovies, getLists, deleteMovie };
