## 🛠️ NextAuth Debugging Guide (App Router + JWT)

### ✅ Quick Checklist Before You Panic:

1. **Did you restart the server after changes?**

   * `pnpm dev` or `npm run dev`
   * Also consider deleting `.next/` with `rm -rf .next`

2. **Did you clear browser cookies?**

   * Especially the `next-auth.session-token` and `next-auth.callback-url`.
   * Recommended after changing any auth callback (`jwt`, `session`).

3. **Did you sign out and sign in again?**

   * This forces regeneration of the JWT and session objects.

4. **Did you update any TypeScript types and not restart TS server?**

   * Restart VSCode or run "TypeScript: Restart TS Server" from the Command Palette.

5. **Did you inspect the server console for logs?**

   * Add logs in `jwt()` and `session()` to understand what's going on.

     ```ts
     console.log('JWT:', token);
     console.log('SESSION:', session);
     ```

6. **Is your `session.user` extended properly?**

   * Add a `next-auth.d.ts` file:

     ```ts
     import NextAuth from "next-auth";

     declare module "next-auth" {
       interface Session {
         user: {
           id: string;
           name: string;
           email: string;
         };
       }

       interface User {
         id: string;
         name: string;
         email: string;
       }
     }
     ```

---

### 🧠 Common Bugs & Solutions

| Symptom                         | Cause                              | Fix                                              |
| ------------------------------- | ---------------------------------- | ------------------------------------------------ |
| `session.user` is `undefined`   | Missing token fields or wrong keys | Ensure you assign `token.id`, `token.name`, etc. |
| JWT data not updated            | Session is cached                  | Sign out, clear cookies, and sign in again       |
| Auth works one day, breaks next | Cached `.next/` or cookies         | Delete `.next/` and cookies, restart dev server  |

---

### 🔁 Dev Commands

```bash
# Clean dev environment
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json # لو كنت بتستخدم npm
Remove-Item -Force pnpm-lock.yaml    # لو كنت بتستخدم pnpm
npm install   # أو pnpm install
npm run dev   # أو pnpm dev
```

---

### ✅ Best Practices

* Always log `user`, `token`, and `session` while developing.
* Don’t forget to include `name` (not `fullName`) in the return object.
* Always assign token fields explicitly (`token.id`, `token.name`, etc.)
* Extend `Session` and `User` properly with a `next-auth.d.ts` file.
* After big changes in auth, force logout and clear cache/cookies.

---

Keep this file bookmarked for when things go mysteriously wrong 🧙‍♂️
