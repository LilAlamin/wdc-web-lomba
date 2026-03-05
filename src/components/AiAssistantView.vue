<template>
  <div class="flex-1 px-10 pb-10 max-w-[1600px] mx-auto w-full flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
    
    <!-- Left Column: Chat Area -->
    <div class="flex-1 flex flex-col gap-6 h-[calc(100vh-140px)] min-h-[600px]">
      
      <!-- Chat Header -->
      <div class="bg-white border-[6px] border-black rounded-[2rem] p-6 flex items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex-shrink-0">
        <div class="flex items-center gap-4">
          <div class="size-14 rounded-full border-4 border-black bg-cyan-300 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span class="font-black text-2xl uppercase">L</span>
          </div>
          <div class="flex flex-col">
            <h2 class="text-2xl font-black uppercase tracking-tight leading-none">Lumina</h2>
            <span class="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">AI Study Companion</span>
          </div>
        </div>
        <div class="flex items-center gap-2 border-4 border-black rounded-full px-4 py-1.5 bg-neo-mint shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <div class="size-3 rounded-full bg-black animate-pulse"></div>
          <span class="font-black uppercase text-sm">Online</span>
        </div>
      </div>

      <!-- Chat Messages Container -->
      <div 
        ref="chatContainer"
        class="flex-1 bg-white border-[6px] border-black rounded-[2rem] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 overflow-y-auto"
      >
        <!-- Welcome Message -->
        <div v-if="messages.length === 0" class="flex flex-col items-center justify-center h-full gap-4 text-center opacity-70">
          <div class="size-24 rounded-full border-[6px] border-black bg-cyan-300 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-2">
            <span class="font-black text-5xl uppercase">L</span>
          </div>
          <h3 class="text-2xl font-black uppercase">Hi, I'm Lumina!</h3>
          <p class="font-bold text-gray-500 max-w-sm">I'm your AI study companion. How can I help you today?</p>
        </div>

        <!-- Render Messages -->
        <template v-for="(msg, index) in messages" :key="index">
          
          <!-- Lumina Message -->
          <div v-if="msg.role === 'model'" class="flex gap-4 max-w-[90%] md:max-w-[85%] animate-in fade-in slide-in-from-left-4 duration-300">
            <div class="size-10 rounded-full border-4 border-black bg-cyan-300 flex items-center justify-center flex-shrink-0 mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span class="font-black text-lg uppercase">L</span>
            </div>
            <div class="bg-neo-mint border-[5px] border-black rounded-2xl rounded-tl-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div class="font-bold text-lg leading-relaxed prose prose-p:my-1 prose-ul:my-2 prose-li:my-0.5 prose-strong:font-black w-full" v-html="formatMessage(msg.text)"></div>
            </div>
          </div>

          <!-- User Message -->
          <div v-else class="flex gap-4 max-w-[90%] md:max-w-[85%] self-end flex-row-reverse animate-in fade-in slide-in-from-right-4 duration-300">
            <div class="size-10 rounded-full border-4 border-black bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span class="material-symbols-outlined font-black text-xl">person</span>
            </div>
            <div class="bg-yellow-300 border-[5px] border-black rounded-2xl rounded-tr-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p class="font-bold text-lg leading-snug whitespace-pre-wrap">{{ msg.text }}</p>
            </div>
          </div>

        </template>

        <!-- Loading Bubble -->
        <div v-if="isLoading" class="flex gap-4 max-w-[85%] animate-in fade-in">
          <div class="size-10 rounded-full border-4 border-black bg-cyan-300 flex items-center justify-center flex-shrink-0 mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span class="font-black text-lg uppercase">L</span>
          </div>
          <div class="bg-neo-mint border-[5px] border-black rounded-2xl rounded-tl-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <div class="size-3 bg-black rounded-full animate-bounce" style="animation-delay: 0ms"></div>
            <div class="size-3 bg-black rounded-full animate-bounce" style="animation-delay: 150ms"></div>
            <div class="size-3 bg-black rounded-full animate-bounce" style="animation-delay: 300ms"></div>
          </div>
        </div>

      </div>

      <!-- Input Area -->
      <div class="flex gap-3 md:gap-4 flex-shrink-0">
        <!-- Clear Chat Button -->
        <button 
          @click="clearChat"
          class="size-14 md:size-16 rounded-2xl border-[5px] border-black bg-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex-shrink-0 active:bg-gray-200"
          title="Clear Chat"
        >
          <span class="material-symbols-outlined font-black text-2xl md:text-3xl text-red-500">delete</span>
        </button>
        
        <!-- Text Input -->
        <div class="flex-1 relative">
          <input 
            v-model="inputText"
            @keydown.enter="sendMessage"
            type="text" 
            placeholder="Type your message..." 
            :disabled="isLoading"
            class="w-full h-14 md:h-16 rounded-2xl border-[5px] border-black bg-white px-4 md:px-6 font-bold text-base md:text-lg focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <!-- Send Button -->
        <button 
          @click="sendMessage"
          :disabled="isLoading || !inputText.trim()"
          class="h-14 md:h-16 px-4 md:px-8 rounded-2xl border-[5px] border-black bg-neo-pink flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        >
          <span class="font-black uppercase text-lg md:text-xl text-white hidden sm:block">Send</span>
          <span class="material-symbols-outlined font-black text-white text-2xl">send</span>
        </button>
      </div>

    </div>

    <!-- Right Sidebar -->
    <div class="w-full lg:w-96 flex flex-col gap-8">
      
      <!-- Quick Questions -->
      <div class="bg-white border-[6px] border-black rounded-[2.5rem] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 class="text-2xl font-black uppercase border-b-[5px] border-black pb-4 mb-6 relative">
          Quick Questions
          <span class="absolute top-0 right-0 material-symbols-outlined text-neo-pink font-black text-3xl animate-pulse">tips_and_updates</span>
        </h3>
        
        <div class="flex flex-col gap-4">
          <button 
            v-for="(q, index) in quickQuestions" 
            :key="index"
            @click="sendQuickQuestion(q)"
            :disabled="isLoading"
            class="w-full p-4 border-4 border-black bg-white rounded-xl font-bold text-lg text-left shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all active:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-between"
          >
            <span>{{ q }}</span>
            <span class="material-symbols-outlined font-black opacity-0 group-hover:opacity-100 transition-opacity text-neo-pink">arrow_forward</span>
          </button>
        </div>
      </div>
      
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';

const API_KEY = "AIzaSyC44rfiTqHfK6HcM0JTNEAPAgBroeyfOls";
const genAI = new GoogleGenerativeAI(API_KEY);

const messages = ref([]);
const inputText = ref('');
const isLoading = ref(false);
const chatContainer = ref(null);
let chatSession = null;

const quickQuestions = [
  "Explain dynamic programming",
  "Summarize the Cold War",
  "How to start a Vue project?",
  "Plan a study schedule for me"
];

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const initChat = async () => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Mulai sekarang, kamu adalah Lumina, asisten belajar AI (AI Study Companion). Kamu harus menjawab setiap pertanyaan murid dengan ringkas, padat, dan bermakna. Jangan bertele-tele. Kamu HARUS mengutamakan Bahasa Indonesia. JIKA ADA YANG BERTANYA SIAPA PENCIPTAMU ATAU SIAPA YANG MEMBUATMU, KAMU HARUS MENJAWAB BAHWA PENCIPTAMU ADALAH RONALD RAMADHANI." }],
        },
        {
          role: "model",
          parts: [{ text: "Mengerti! Saya adalah Lumina buatan Ronald Ramadhani. Saya siap membantu proses belajarmu dengan jawaban yang ringkas, padat, bermakna, dan menggunakan Bahasa Indonesia." }],
        },
      ],
    });
  } catch (error) {
    console.error("Error initializing chat:", error);
    messages.value.push({
      role: 'model',
      text: "Sorry, I couldn't connect to my brain. Please check your API key or internet connection."
    });
  }
};

const formatMessage = (text) => {
  // Convert markdown to HTML and fix some spacing for Tailwind prose
  const html = marked.parse(text || "");
  return html.replace(/<ul>/g, '<ul class="list-disc pl-6 space-y-1">')
             .replace(/<ol>/g, '<ol class="list-decimal pl-6 space-y-1">')
             .replace(/<p>/g, '<p class="mb-2 last:mb-0">')
             .replace(/<a /g, '<a class="text-blue-600 underline" target="_blank" rel="noopener noreferrer" ');
};

const sendMessage = async () => {
  const text = inputText.value.trim();
  if (!text || isLoading.value || !chatSession) return;

  // Add user message to UI
  messages.value.push({ role: 'user', text });
  inputText.value = '';
  isLoading.value = true;
  await scrollToBottom();

  try {
    const result = await chatSession.sendMessage(text);
    const response = await result.response;
    
    // Add Lumina response
    messages.value.push({ role: 'model', text: response.text() });
  } catch (error) {
    console.error("Error sending message:", error);
    
    let errorMessage = "**Error:** Sorry, I encountered a problem thinking of an answer. Please try again.";
    
    // Check if the error is related to Quota / Rate Limit (429)
    if (error.message && (error.message.includes('429') || error.message.toLowerCase().includes('quota') || error.message.toLowerCase().includes('exhausted'))) {
      errorMessage = "**Limit Tercapai (429):** API Key kamu sepertinya mencapai batas limit (*Rate Limit*). Untuk _free tier_ Gemini 2.5 Flash, batasnya adalah 5 *Request Per Minute* (RPM). Walaupun sudah pasang *billing*, pastikan API Key ini di-*generate* dari Google Cloud Project yang *Billing*-nya sudah aktif, bukan dari *project* gratisan. Tunggu sekitar satu menit lalu coba lagi ya!";
    }

    messages.value.push({ 
      role: 'model', 
      text: errorMessage 
    });
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
};

const sendQuickQuestion = (question) => {
  inputText.value = question;
  sendMessage();
};

const clearChat = () => {
  messages.value = [];
  initChat(); // Re-initialize the session to clear history context
};

onMounted(() => {
  initChat();
});
</script>

<style scoped>
/* Scoped styles to ensure markdown renders well within the neobrutalism theme */
:deep(.prose) {
  max-width: 100%;
}
:deep(.prose pre) {
  background-color: #1e293b;
  color: #f8fafc;
  padding: 1rem;
  border-radius: 0.5rem;
  border: 4px solid black;
  overflow-x: auto;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}
:deep(.prose code) {
  background-color: rgba(0,0,0,0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
  font-family: monospace;
  font-weight: bold;
}
:deep(.prose pre code) {
  background-color: transparent;
  padding: 0;
  border-radius: 0;
}
</style>
