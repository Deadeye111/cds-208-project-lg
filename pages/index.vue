<script setup>
import { useDark, useToggle } from "@vueuse/core";

const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
  <main class="dark:bg-[#121212] bg-white min-h-screen pb-20">
    <Header title="Welcome to DataFlow Canban" />

    <div class="container mx-auto mt-5 p-5">
      <div class="flex justify-center">
          <div class="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-5 w-full">
            <div class="bg-transparent flex-grow flex justify-center items-center">
              <NuxtLink to="/dashboard" class="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <span class="text-center w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#121212] rounded-md group-hover:bg-opacity-0">
                To Dashboard
                </span>
              </NuxtLink>
            </div>

            <div class="bg-transparent flex-grow flex justify-center items-center">
              <NuxtLink to="/account" class="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                <span class="text-center w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#121212] rounded-md group-hover:bg-opacity-0">
                To Account
                </span>
              </NuxtLink>
            </div>

            <div class="bg-transparent flex-grow flex justify-center items-center">
              <button 
                @click="toggleDark()"
                class="w-full relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
              >
                <span class="w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-[#121212] rounded-md group-hover:bg-opacity-0">
                Dark/light mode
                </span>
              </button>
            </div>
          </div>
      </div>
    </div>

    <div class="container mx-auto p-5">
      <div class="flex justify-center">
          <div class="grid grid-cols-1 gap-5 w-full">
              <div class="bg-white dark:bg-[#121212] p-4 shadow-md rounded-lg flex-grow border-2 border-solid border-slate-200">
                <h1 class="text-xl font-bold text-center w-full h-auto mb-4 dark:text-white">
                  What is DataFlow Canban?
                </h1>
                <p class="w-full h-auto mb-4 dark:text-white">
                  DataFlow Kanban is an app for managing your tasks with ease and efficiency.
                </p>
                <ul class="space-y-4 dark:text-white">
                  <li>
                      <p class="font-bold">Kanban Board Creation:</p>
                      <p class="ml-4">With DataFlow Kanban, creating Kanban boards tailored to your specific needs is a breeze. Whether you're managing personal projects or business operations, you can easily set up customizable boards to visualize your workflow.</p>
                  </li>
                  <li>
                      <p class="font-bold">Simple Interface:</p>
                      <p class="ml-4">Say goodbye to tedious manual task management. DataFlow Kanban lets you effortlessly move cards across your boards with a simple interface. Whether you're reordering tasks or updating statuses, it's all smooth sailing.</p>
                  </li>
                  <li>
                      <p class="font-bold">Task Customization:</p>
                      <p class="ml-4">Each task on your Kanban board can be fully customized to suit your requirements.</p>
                  </li>
                </ul>
                <br>
                <p class="w-full h-auto mb-4 dark:text-white">
                  Access your personal dashboard below
                </p>
                <NuxtLink to="/dashboard">
                    <button class="bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 py-2 px-4">
                        To your dashboard
                    </button>
                </NuxtLink>
              </div>
          </div>
      </div>
    </div>
    <Footer />
  </main>
</template>