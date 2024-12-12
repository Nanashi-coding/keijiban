// Firebase設定
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAkUIDT2cKuL7JZyY9AhX8c_Jm4B6doqSc",
  authDomain: "anonymous-keijiban.firebaseapp.com",
  projectId: "anonymous-keijiban",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 掲示板作成
document.getElementById("createBoardForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const boardName = document.getElementById("boardName").value;
  const boardPassword = document.getElementById("boardPassword").value;

  await setDoc(doc(db, "boards", boardName), { password: boardPassword, messages: [] });
  alert("掲示板が作成されました！");
});

// 掲示板に入る
document.getElementById("joinBoardForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const boardName = document.getElementById("joinBoardName").value;
  const boardPassword = document.getElementById("joinBoardPassword").value;

  const boardDoc = await getDoc(doc(db, "boards", boardName));
  if (boardDoc.exists() && boardDoc.data().password === boardPassword) {
    // 掲示板画面に遷移
    loadBoard(boardName);
  } else {
    alert("掲示板名またはパスワードが間違っています");
  }
});

// 掲示板読み込み
async function loadBoard(boardName) {
  const boardDoc = await getDoc(doc(db, "boards", boardName));
  if (boardDoc.exists()) {
    document.getElementById("boardTitle").innerText = boardName;
    const messages = boardDoc.data().messages;
    // メッセージを表示
    const messagesDiv = document.getElementById("messages");
    messagesDiv.innerHTML = messages.map(msg => `<p>${msg}</p>`).join("");
  }
}

// メッセージ投稿
document.getElementById("postMessageForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const message = document.getElementById("message").value;
  const boardName = document.getElementById("boardTitle").innerText;

  const boardDoc = await getDoc(doc(db, "boards", boardName));
  if (boardDoc.exists()) {
    const messages = boardDoc.data().messages || [];
    messages.push(message);

    await setDoc(doc(db, "boards", boardName), { ...boardDoc.data(), messages });
    loadBoard(boardName);
  }
});
