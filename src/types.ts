export type MaterialNode = {
  id: string;
  parentId: string | null;
  order: number;
  zhTitle: string;
  enTitle: string;
  zhSummary: string;
  enSummary: string;
  zhContent: string;
  enContent: string;
  tags: string[];
  relatedQuestions: string[];
  children?: MaterialNode[];
  createdAt: string;
  updatedAt: string;
};

export type RecordingItem = {
  id: string;
  nodeId: string;
  audioBlob: Blob;
  duration: number;
  reviewNote: string;
  selfScore?: number;
  createdAt: string;
};

export type AppSettings = {
  id: string;
  ownerName: string;
  targetBand: string;
  seededAt?: string;
  updatedAt: string;
};

export type VocabularyDifficulty = "easy" | "medium" | "hard";

export type VocabularyStatus = "new" | "learning" | "mastered";

export type VocabularySource = "manual" | "seed";

export type VocabularyItem = {
  id: string;
  nodeId?: string;
  word: string;
  phrase?: string;
  meaningZh: string;
  meaningEn: string;
  exampleSentence: string;
  exampleTranslation?: string;
  tags: string[];
  difficulty: VocabularyDifficulty;
  status: VocabularyStatus;
  source: VocabularySource;
  createdAt: string;
  updatedAt: string;
};

export type ExportRecordingItem = Omit<RecordingItem, "audioBlob"> & {
  audioDataUrl: string;
  audioType: string;
};

export type AppExport = {
  version: 1;
  exportedAt: string;
  materialNodes: MaterialNode[];
  recordings: ExportRecordingItem[];
  appSettings: AppSettings[];
};
