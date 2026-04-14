"use client";

import { create } from "zustand";

import type { GeneratedArticle } from "@/lib/types";

interface ArticleStore {
  articles: GeneratedArticle[];
  currentArticle: GeneratedArticle | null;
  isGenerating: boolean;
  addArticle: (article: GeneratedArticle) => void;
  setCurrentArticle: (article: GeneratedArticle | null) => void;
  setIsGenerating: (value: boolean) => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  currentArticle: null,
  isGenerating: false,
  addArticle: (article) =>
    set((state) => ({
      articles: [article, ...state.articles],
      currentArticle: article,
    })),
  setCurrentArticle: (article) => set({ currentArticle: article }),
  setIsGenerating: (value) => set({ isGenerating: value }),
}));
