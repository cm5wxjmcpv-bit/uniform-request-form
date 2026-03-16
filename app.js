diff --git a/app.js b/app.js
index 52f0120594a6209d1248b243d1cdcd7c0c541b88..e4f674b792c31e8af0e89e85196241614074867f 100644
--- a/app.js
+++ b/app.js
@@ -1,83 +1,52 @@
-function qs(name) {
-  return new URLSearchParams(location.search).get(name);
-}
+const SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
 
-function requireAuth() {
-  const u = sessionStorage.getItem("username");
-  if (!u) location.href = "index.html";
-  return u;
-}
+const form = document.getElementById("replacement-form");
+const message = document.getElementById("message");
 
-async function login(username, password) {
-  const url = `${APP_SCRIPT_URL}?action=validateLogin&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
-  const r = await fetch(url, { method: "GET", cache: "no-store" });
+form.addEventListener("submit", async (event) => {
+  event.preventDefault();
 
-  if (!r.ok) {
-    throw new Error(`Login failed: ${r.status}`);
-  }
-
-  const data = await r.json();
-
-  if (!data.ok) return false;
-
-  sessionStorage.setItem("username", data.username);
-  return true;
-}
+  message.textContent = "";
+  message.className = "";
 
-function logout() {
-  sessionStorage.removeItem("username");
-  location.href = "index.html";
-}
-
-async function apiGetStatus(username) {
-  const url = `${APP_SCRIPT_URL}?action=getStatus&username=${encodeURIComponent(username)}`;
-  const r = await fetch(url, { method: "GET", cache: "no-store" });
-
-  if (!r.ok) {
-    throw new Error(`GET status failed: ${r.status}`);
+  if (!form.checkValidity()) {
+    message.textContent = "Please complete all required fields correctly.";
+    message.classList.add("error");
+    form.reportValidity();
+    return;
   }
 
-  return await r.json();
-}
-
-async function apiLogModule(username, moduleId) {
-  const r = await fetch(APP_SCRIPT_URL, {
-    method: "POST",
-    body: JSON.stringify({
-      action: "logModule",
-      username: username,
-      moduleId: moduleId
-    })
-  });
-
-  if (!r.ok) {
-    throw new Error(`Log module failed: ${r.status}`);
-  }
-
-  return await r.json();
-}
-
-async function apiLogTest(username, complete, score) {
-  const r = await fetch(APP_SCRIPT_URL, {
-    method: "POST",
-    body: JSON.stringify({
-      action: "logTest",
-      username: username,
-      complete: complete,
-      score: score
-    })
-  });
-
-  if (!r.ok) {
-    throw new Error(`Log test failed: ${r.status}`);
-  }
-
-  return await r.json();
-}
-
-function allModulesComplete(status) {
-  for (let i = 1; i <= 10; i++) {
-    if (!status.modules["m" + i]) return false;
+  const submitButton = form.querySelector("button[type='submit']");
+  submitButton.disabled = true;
+
+  const payload = {
+    employeeName: form.employeeName.value.trim(),
+    employeeEmail: form.employeeEmail.value.trim(),
+    itemRequested: form.itemRequested.value.trim(),
+    reason: form.reason.value.trim()
+  };
+
+  try {
+    const response = await fetch(SCRIPT_URL, {
+      method: "POST",
+      headers: {
+        "Content-Type": "text/plain;charset=utf-8"
+      },
+      body: JSON.stringify(payload)
+    });
+
+    if (!response.ok) {
+      throw new Error(`Request failed with status ${response.status}`);
+    }
+
+    message.textContent = "Request submitted successfully.";
+    message.classList.add("success");
+    form.reset();
+  } catch (error) {
+    console.error(error);
+    message.textContent = "There was a problem submitting your request. Please try again.";
+    message.classList.add("error");
+  } finally {
+    submitButton.disabled = false;
   }
-  return true;
-}
+});
