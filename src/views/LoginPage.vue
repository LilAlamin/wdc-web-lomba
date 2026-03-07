<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const email = ref("");
const password = ref("");
const isLoading = ref(false);

const handleLogin = () => {
  isLoading.value = true;
  // Dummy login - any credentials work
  setTimeout(() => {
    sessionStorage.setItem("isLoggedIn", "true");
    router.push("/dashboard");
  }, 800);
};

const goBack = () => {
  router.push("/");
};
</script>

<template>
  <div
    class="min-h-screen flex items-center justify-center bg-background-light px-6 relative overflow-hidden"
  >
    <!-- Decorative shapes -->
    <div
      class="absolute -top-20 -left-20 w-72 h-72 bg-neo-pink rounded-full opacity-15 blur-3xl"
    ></div>
    <div
      class="absolute -bottom-20 -right-20 w-72 h-72 bg-neo-blue rounded-full opacity-15 blur-3xl"
    ></div>
    <div
      class="absolute top-1/4 right-1/4 w-40 h-40 bg-primary opacity-10 blur-2xl"
    ></div>

    <!-- Decorative blocks -->
    <div
      class="absolute top-10 left-10 w-16 h-16 bg-neo-mint border-4 border-black shadow-neo rotate-12 hidden md:block"
    ></div>
    <div
      class="absolute bottom-20 right-16 w-12 h-12 bg-neo-orange border-4 border-black shadow-neo -rotate-6 hidden md:block"
    ></div>
    <div
      class="absolute top-1/3 right-10 w-10 h-10 bg-primary border-4 border-black shadow-neo rotate-45 hidden md:block"
    ></div>
    <div
      class="absolute bottom-1/3 left-16 w-14 h-14 bg-neo-pink border-4 border-black shadow-neo rounded-full hidden md:block"
    ></div>

    <!-- Login Card -->
    <div
      class="relative z-10 w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col"
    >
      <!-- Card Header -->
      <div
        class="p-6 bg-primary border-b-4 border-black flex items-center justify-between"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center bg-white border-4 border-black rounded shadow-neo"
          >
            <span class="material-symbols-outlined font-black text-black"
              >auto_stories</span
            >
          </div>
          <div>
            <h1 class="text-xl font-black uppercase tracking-wider text-black">
              Login
            </h1>
            <p class="text-xs font-bold text-black/70 uppercase">
              Buku Sakti Mahasiswa
            </p>
          </div>
        </div>
        <button
          @click="goBack"
          class="w-10 h-10 flex items-center justify-center bg-white border-2 border-black hover:shadow-neo transition-all cursor-pointer"
        >
          <span class="material-symbols-outlined font-black text-black"
            >arrow_back</span
          >
        </button>
      </div>

      <!-- Card Body -->
      <div class="p-6 flex flex-col gap-5">
        <!-- Welcome text -->
        <div class="text-center mb-2">
          <h2 class="text-2xl font-black uppercase">Selamat Datang! 👋</h2>
          <p class="text-sm font-bold text-gray-500 mt-1">
            Masukkan data apapun untuk login (dummy)
          </p>
        </div>

        <!-- Email Field -->
        <div class="flex flex-col gap-2">
          <label
            class="font-black uppercase text-xs text-gray-500"
            for="email"
            >Email / NIM</label
          >
          <div class="relative">
            <span
              class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black font-bold"
              >mail</span
            >
            <input
              id="email"
              v-model="email"
              type="text"
              placeholder="mahasiswa@kampus.ac.id"
              class="w-full border-4 border-black rounded py-3 pl-11 pr-4 font-bold text-black bg-white focus:shadow-neo focus:outline-none transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="flex flex-col gap-2">
          <label
            class="font-black uppercase text-xs text-gray-500"
            for="password"
            >Password</label
          >
          <div class="relative">
            <span
              class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-black font-bold"
              >lock</span
            >
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              class="w-full border-4 border-black rounded py-3 pl-11 pr-4 font-bold text-black bg-white focus:shadow-neo focus:outline-none transition-all placeholder:text-gray-400"
              @keyup.enter="handleLogin"
            />
          </div>
        </div>

        <!-- Login Button -->
        <button
          @click="handleLogin"
          :disabled="isLoading"
          :class="[
            'w-full py-4 border-4 border-black font-black uppercase text-lg tracking-wide transition-all flex items-center justify-center gap-3 cursor-pointer mt-2',
            isLoading
              ? 'bg-gray-300 text-gray-500 cursor-wait'
              : 'bg-neo-mint text-black shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1',
          ]"
        >
          <span
            v-if="isLoading"
            class="material-symbols-outlined animate-spin font-bold"
            >progress_activity</span
          >
          <span v-if="isLoading">Memproses...</span>
          <template v-else>
            Masuk
            <span class="material-symbols-outlined font-black"
              >login</span
            >
          </template>
        </button>

        <!-- Divider -->
        <div class="flex items-center gap-4 my-1">
          <div class="flex-1 h-1 bg-black"></div>
          <span class="font-black text-xs uppercase text-gray-400">atau</span>
          <div class="flex-1 h-1 bg-black"></div>
        </div>

        <!-- Google Login (Dummy) -->
        <button
          @click="handleLogin"
          class="w-full py-3 border-4 border-black bg-white font-bold uppercase text-sm shadow-neo hover:shadow-neo-hover hover:translate-y-1 hover:translate-x-1 transition-all flex items-center justify-center gap-3 cursor-pointer"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Login dengan Google
        </button>
      </div>

      <!-- Card Footer -->
      <div
        class="p-4 border-t-4 border-black bg-background-light flex items-center justify-center gap-2"
      >
        <span class="font-bold text-sm text-gray-500">Belum punya akun?</span>
        <button
          @click="handleLogin"
          class="font-black text-sm text-neo-pink uppercase hover:underline cursor-pointer"
        >
          Daftar Gratis
        </button>
      </div>
    </div>
  </div>
</template>
