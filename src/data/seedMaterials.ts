import type { MaterialNode } from "@/types";

const now = "2026-05-02T00:00:00.000Z";

type ChildSeed = {
  slug: string;
  zhTitle: string;
  enTitle: string;
  zhSummary: string;
  enSummary: string;
  zhContent: string;
  enContent: string;
  tags: string[];
  relatedQuestions: string[];
};

type MainSeed = {
  slug: string;
  order: number;
  zhTitle: string;
  enTitle: string;
  zhSummary: string;
  enSummary: string;
  zhContent: string;
  enContent: string;
  tags: string[];
  relatedQuestions: string[];
  children: ChildSeed[];
};

const mainSeeds: MainSeed[] = [
  {
    slug: "name",
    order: 1,
    zhTitle: "名字",
    enTitle: "Name",
    zhSummary: "“雨娆”这个名字带有水、女性气质和智慧的含义，也承载了父母的期待。",
    enSummary:
      "The name Yurao carries ideas of water, femininity, wisdom, and the expectations of her parents.",
    zhContent:
      "Use these exact Chinese originals for the corresponding main node zhContent fields. Keep first person, punctuation, and paragraph breaks. Do not rewrite.",
    enContent:
      "My name is Feng Yurao. In Chinese, “Yu” means rain, and it is also related to the water element in traditional culture. To me, this character feels gentle, flowing, and full of life. “Rao” has a feminine component, and it is also connected with “Yao”, a legendary wise ruler in ancient China. So my name was not chosen randomly. It suggests femininity, wisdom, and capability. I think my parents hoped I would become a woman who is gentle but not weak, and intelligent as well as capable. I did not think much about the meaning of my name when I was younger, but while preparing for IELTS Speaking, I realized that a name can be a small but meaningful entrance into a person’s identity.",
    tags: ["name", "identity", "family", "culture", "meaning"],
    relatedQuestions: [
      "What does your name mean?",
      "Who gave you your name?",
      "Do Chinese people care about the meaning of names?",
      "Would you like to change your name?"
    ],
    children: [
      {
        slug: "meaning",
        zhTitle: "雨和水元素",
        enTitle: "Rain and the water element",
        zhSummary: "“雨”让名字带有温和、流动和生命力的感觉。",
        enSummary: "The character “Yu” makes the name feel gentle, flowing, and lively.",
        zhContent:
          "“雨”是我名字里最容易解释的部分。它代表雨水，也让我想到水元素。水不是特别强硬的东西，但它很有韧性，也能滋养生命。我喜欢这个字带来的感觉，它不像一些很锋利、很强势的字，而是更温和、更有流动感。",
        enContent:
          "“Yu” is the easiest part of my name to explain. It means rain, and it also reminds me of the water element. Water is not aggressive, but it is flexible and life-giving. I like the feeling of this character because it sounds gentle and fluid rather than sharp or forceful.",
        tags: ["name", "culture", "water", "identity"],
        relatedQuestions: [
          "What does your name mean?",
          "Do you like your name?",
          "Are names important in your culture?"
        ]
      },
      {
        slug: "parents-expectation",
        zhTitle: "父母的期待",
        enTitle: "Parents' expectations",
        zhSummary: "父母希望她成为智慧、有能力、也有女性力量的人。",
        enSummary:
          "Her parents hoped she would become a wise and capable woman with inner strength.",
        zhContent:
          "我觉得父母取这个名字时，是带着很明显的期待的。“娆”有女字旁，但又和“尧”有关，所以它不是单纯强调漂亮或者柔美，而是更像一种有智慧、有能力的女性形象。这一点和我现在对自己的期待也挺接近的。",
        enContent:
          "I think my parents had clear expectations when they chose this name. “Rao” has a feminine component, but it is also connected with “Yao”, a wise ruler. So it is not just about beauty or softness. It suggests a wise and capable female image, which is actually quite close to how I want to see myself now.",
        tags: ["name", "family", "identity", "expectation"],
        relatedQuestions: [
          "Who gave you your name?",
          "Do parents in your country choose names carefully?",
          "Do names affect people's identity?"
        ]
      },
      {
        slug: "identity-entry",
        zhTitle: "名字作为身份入口",
        enTitle: "Name as an identity entry",
        zhSummary: "准备口语时重新理解名字，让它变成介绍自我的素材。",
        enSummary:
          "Revisiting her name during speaking preparation turns it into a personal introduction material.",
        zhContent:
          "以前别人问我的名字，我可能只会说它怎么写。但现在我会觉得，名字其实可以连接到家庭、文化和自我认同。它不是一个很宏大的话题，却很适合在口语里自然地展开，因为它是真实的个人素材。",
        enContent:
          "In the past, if someone asked about my name, I would probably just explain how to write it. Now I feel that a name can be connected with family, culture, and self-identity. It is not a huge topic, but it is very useful in speaking because it is personal and real.",
        tags: ["name", "identity", "speaking", "personal-material"],
        relatedQuestions: [
          "How do you introduce yourself?",
          "Do you think names can show culture?",
          "Is it easy to remember people's names?"
        ]
      }
    ]
  },
  {
    slug: "hometown",
    order: 2,
    zhTitle: "家乡",
    enTitle: "Hometown",
    zhSummary: "她来自廊坊，一个靠近北京、生活便利但经济发展节奏变慢的小城市。",
    enSummary:
      "She comes from Langfang, a small city near Beijing that is convenient but developing more slowly now.",
    zhContent:
      "我来自廊坊，中国的一个小城市。我的家乡最大的特点是它离北京很近。因为它是一个小城市，所以生活成本不是很高，但生活仍然很便利，因为人们可以比较容易地享受到附近更好的医疗、教育和交通资源。我很喜欢我的家乡，近几年一个很大的变化是空气变得更清新了，因为工厂搬走了，但是经济发展变得缓慢了。为什么工厂搬走是因为曾经廊坊天气太差了",
    enContent:
      "I come from Langfang, a small city very close to Beijing. It is not as big as Beijing, and it does not have as many cultural events or career opportunities, but daily life there is quite convenient. The cost of living is lower than in first-tier cities, and because it is near Beijing, people can still access better medical, educational, and transport resources. It only takes about 21 minutes to get from my home to Beijing by high-speed rail, and Beijing Daxing Airport is also nearby. So sometimes I feel Langfang is like a quieter living area next to Beijing. In recent years, the air has become cleaner because many factories moved away, but the local economy has also slowed down a bit. Overall, I like the convenience and familiarity of my hometown, but for future career opportunities, I may prefer to move to Beijing.",
    tags: ["hometown", "langfang", "beijing", "lifestyle", "change"],
    relatedQuestions: [
      "Tell me about your hometown.",
      "Has your hometown changed in recent years?",
      "Do you like your hometown?",
      "Would you like to live in your hometown in the future?"
    ],
    children: [
      {
        slug: "near-beijing",
        zhTitle: "靠近北京的便利",
        enTitle: "Convenience near Beijing",
        zhSummary: "廊坊离北京很近，可以共享部分大城市资源。",
        enSummary:
          "Langfang is close to Beijing, so it can benefit from some big-city resources.",
        zhContent:
          "廊坊最大的特点之一就是离北京近。对我来说，这意味着我不一定生活在特别拥挤的大城市里，但仍然可以比较方便地去北京看展、办事、坐飞机或者接触更多机会。这种位置优势让我觉得家乡很实用。",
        enContent:
          "One of the biggest features of Langfang is that it is close to Beijing. For me, it means I do not have to live in an extremely crowded big city, but I can still go to Beijing for exhibitions, errands, flights, or more opportunities. This location makes my hometown very practical.",
        tags: ["hometown", "beijing", "transport", "convenience"],
        relatedQuestions: [
          "Where is your hometown located?",
          "Is transportation convenient in your hometown?",
          "Do people in your hometown often visit nearby cities?"
        ]
      },
      {
        slug: "cleaner-air",
        zhTitle: "空气和城市变化",
        enTitle: "Cleaner air and city changes",
        zhSummary: "工厂搬走后空气改善了，但经济发展也变慢了。",
        enSummary:
          "The air improved after factories moved away, but economic growth also slowed down.",
        zhContent:
          "这几年廊坊的空气确实比以前更好，尤其是天空看起来更干净。一个重要原因是很多工厂搬走了。这个变化对生活质量是好事，但也带来另一个问题，就是城市的经济活力好像没有以前那么强。",
        enContent:
          "In recent years, the air in Langfang has definitely become better, and the sky looks cleaner. One important reason is that many factories moved away. This is good for quality of life, but it also brings another issue: the city seems less economically active than before.",
        tags: ["hometown", "environment", "change", "economy"],
        relatedQuestions: [
          "Has your hometown changed recently?",
          "Do you think environmental changes affect people's lives?",
          "What changes would you like to see in your hometown?"
        ]
      },
      {
        slug: "future-beijing",
        zhTitle: "未来想去北京发展",
        enTitle: "Future development in Beijing",
        zhSummary: "她喜欢家乡，但未来更看重北京的职业和设计机会。",
        enSummary:
          "She likes her hometown, but Beijing offers more career and design opportunities.",
        zhContent:
          "我对廊坊是有感情的，因为它熟悉、方便，也有家人在。但如果考虑未来职业发展，尤其是工业设计相关的机会，我可能会更倾向于北京。北京的资源、公司和展览都更多，也更适合年轻设计师成长。",
        enContent:
          "I have emotional attachment to Langfang because it is familiar, convenient, and my family is there. But if I think about my future career, especially opportunities related to industrial design, I would probably prefer Beijing. It has more resources, companies, and exhibitions, so it may be better for a young designer's growth.",
        tags: ["hometown", "career", "beijing", "design"],
        relatedQuestions: [
          "Would you like to live in your hometown in the future?",
          "Why do young people move to big cities?",
          "What kind of city is good for career development?"
        ]
      }
    ]
  },
  {
    slug: "study",
    order: 3,
    zhTitle: "学习",
    enTitle: "Study",
    zhSummary: "她本科读建筑学，准备转向工业设计硕士，因为更想做完整、个人尺度的设计。",
    enSummary:
      "She studied architecture and is preparing for industrial design because she prefers complete design work on a more personal scale.",
    zhContent:
      "目前我是一名学生。我本科读的是建筑学，接下来准备攻读工业设计硕士。我真的很喜欢建筑学，因为它帮助我理解人的需求，也让我看到设计如何影响人们的生活。但我想学习工业设计，是因为我更喜欢能够掌控整个设计过程。建筑项目通常需要很多人共同完成，而工业设计可以让我在更小、更个人化的尺度上发展自己的想法。",
    enContent:
      "I studied architecture for my undergraduate degree, and I am preparing to apply for, or pursue, a master's degree in industrial design. Architecture has influenced me a lot. It taught me to understand design through people's needs, spatial experience, and social context. For example, when designing an architectural project, I cannot only think about appearance. I also need to consider how people move, stay, and feel in a space. Later, I realized that I wanted to move toward industrial design because it works on a smaller and more personal scale. It is closer to daily life, and it allows me to control a more complete design process, from research and concepts to sketches, modeling, and prototyping. I am not rejecting architecture. I just feel it gave me a strong design foundation, while industrial design may fit my future better.",
    tags: ["study", "architecture", "industrial-design", "design", "career"],
    relatedQuestions: [
      "What do you study?",
      "Why did you choose this subject?",
      "What do you plan to study in the future?",
      "Do you prefer studying alone or with others?"
    ],
    children: [
      {
        slug: "architecture-foundation",
        zhTitle: "建筑学带来的设计基础",
        enTitle: "Design foundation from architecture",
        zhSummary: "建筑学帮助她理解人的需求、空间体验和设计逻辑。",
        enSummary:
          "Architecture helped her understand human needs, spatial experience, and design logic.",
        zhContent:
          "建筑学最有价值的地方，是它训练我从人的行为和体验出发去思考。一个空间不是画得好看就够了，它需要回应使用者的需求。这个训练让我后来做工业设计时，也会自然地先问：这个产品到底解决谁的问题？",
        enContent:
          "The most valuable part of architecture is that it trained me to think from people's behavior and experience. A space is not enough just because it looks good. It has to respond to users' needs. This training also affects my industrial design thinking, because I naturally ask: whose problem does this product solve?",
        tags: ["study", "architecture", "design", "user-needs"],
        relatedQuestions: [
          "What did you learn from your major?",
          "Is your subject practical?",
          "How does your subject affect your life?"
        ]
      },
      {
        slug: "industrial-design-shift",
        zhTitle: "转向工业设计",
        enTitle: "Shift to industrial design",
        zhSummary: "工业设计更贴近日常生活，也更容易掌控完整流程。",
        enSummary:
          "Industrial design is closer to daily life and allows a more complete design process.",
        zhContent:
          "我想转向工业设计，是因为它和人的日常生活距离更近。一个产品可能很小，但它会被人每天触摸、使用和依赖。我喜欢这种更具体、更个人化的设计关系，也喜欢从想法一路做到原型的过程。",
        enContent:
          "I want to shift to industrial design because it is closer to people's daily life. A product may be small, but people touch it, use it, and rely on it every day. I like this more concrete and personal design relationship, and I also enjoy the process of developing an idea into a prototype.",
        tags: ["study", "industrial-design", "product-design", "future"],
        relatedQuestions: [
          "What do you want to study in the future?",
          "Why are you interested in design?",
          "What kind of work would you like to do?"
        ]
      },
      {
        slug: "learning-style",
        zhTitle: "学习方式和工具",
        enTitle: "Learning style and tools",
        zhSummary: "她喜欢用阅读、整理和 AI 工具帮助自己形成想法。",
        enSummary:
          "She uses reading, organizing, and AI tools to clarify and develop her ideas.",
        zhContent:
          "我的学习方式不是单纯背知识点。我更喜欢先阅读和收集信息，然后把自己的想法整理出来。最近我经常会打开 GPT，把一些模糊想法说出来，再根据反馈重新组织。这对我来说更像一种思维整理工具。",
        enContent:
          "My way of studying is not just memorizing information. I prefer reading and collecting materials first, and then organizing my own ideas. Recently, I often open GPT, explain my rough thoughts, and reorganize them based on the feedback. For me, it works more like a tool for thinking and structuring ideas.",
        tags: ["study", "learning", "ai-tools", "reflection"],
        relatedQuestions: [
          "How do you usually study?",
          "Do you use technology when studying?",
          "Do students today rely too much on technology?"
        ]
      }
    ]
  },
  {
    slug: "accommodation",
    order: 4,
    zhTitle: "居住",
    enTitle: "Accommodation",
    zhSummary: "她目前和家人住在热闹居民区，未来想去北京，理想家是有花园的大房子。",
    enSummary:
      "She lives with her family in a lively residential area, wants to move to Beijing, and dreams of a spacious home with a garden.",
    zhContent:
      "现在我和家人住在一套居民楼住宅里。它位于一个热闹的居民区，附近有很多商店、餐厅和教育设施，所以日常生活很方便。未来我想搬到北京，因为那里有更多职业机会。我梦想中的家是一栋大房子，有足够的空间，也许还有一个小花园，虽然我知道在北京实现这个目标会很难。不过，我会努力朝这个方向前进。",
    enContent:
      "I currently live with my family in an apartment building in a lively residential area. There are shops, restaurants, educational facilities, and daily services nearby, so life is very convenient. The area is not extremely quiet, but I am used to its rhythm. Living with my family gives me a sense of security, and we can take care of each other, although sometimes I have less personal space. In the future, if I have the chance, I would like to move to Beijing because it offers more design-related career opportunities, and it is easier to attend exhibitions, lectures, and meet different people. As for my dream home, I would like a spacious house with a small garden. It does not need to be luxurious, but I hope it has natural light, a comfortable workspace, and enough space for relaxing and cooking.",
    tags: ["accommodation", "home", "family", "beijing", "lifestyle"],
    relatedQuestions: [
      "Describe your home.",
      "Do you like the area where you live?",
      "Who do you live with?",
      "Where would you like to live in the future?"
    ],
    children: [
      {
        slug: "family-home",
        zhTitle: "和家人一起住",
        enTitle: "Living with family",
        zhSummary: "和家人同住让她有安全感，但个人空间会少一些。",
        enSummary:
          "Living with family gives her security, but sometimes reduces personal space.",
        zhContent:
          "我现在和家人一起住，这对我来说很自然。家里有人会让我觉得安心，尤其是在学习压力比较大的时候。但同时，我也会希望有更多独立空间，可以安静地做设计、读书或者整理想法。",
        enContent:
          "I live with my family now, and it feels natural to me. Having family members at home makes me feel secure, especially when I am under study pressure. At the same time, I sometimes wish I had more independent space where I could quietly design, read, or organize my thoughts.",
        tags: ["accommodation", "family", "home", "privacy"],
        relatedQuestions: [
          "Who do you live with?",
          "What are the advantages of living with family?",
          "Do you prefer living alone or with others?"
        ]
      },
      {
        slug: "residential-area",
        zhTitle: "热闹的居民区",
        enTitle: "Lively residential area",
        zhSummary: "附近生活设施多，日常方便，但不是特别安静。",
        enSummary:
          "The neighborhood is convenient with many facilities, though not very quiet.",
        zhContent:
          "我住的区域比较热闹，附近买东西、吃饭、上课都很方便。我觉得这种生活氛围比较真实，有很多普通人的日常。但如果需要长时间专注学习，周围的声音有时也会让我有点分心。",
        enContent:
          "The area where I live is quite lively. It is convenient for shopping, eating out, and taking classes. I like this realistic daily atmosphere because it is full of ordinary life. But when I need to focus for a long time, the noise around me can sometimes be distracting.",
        tags: ["accommodation", "neighborhood", "convenience", "lifestyle"],
        relatedQuestions: [
          "Do you like your neighborhood?",
          "What facilities are near your home?",
          "Is your area quiet or lively?"
        ]
      },
      {
        slug: "dream-home",
        zhTitle: "理想中的家",
        enTitle: "Dream home",
        zhSummary: "她理想中的家有自然光、工作区、厨房和小花园。",
        enSummary:
          "Her dream home has natural light, a workspace, a kitchen, and a small garden.",
        zhContent:
          "我梦想中的家不一定要特别豪华，但要舒服。它最好有很好的自然光，一个能让我画图和做设计的工作区，一个适合做饭的厨房，还有一个小花园。花园不需要很大，只要能让我接触自然就很好。",
        enContent:
          "My dream home does not have to be very luxurious, but it should be comfortable. Ideally, it would have good natural light, a workspace where I can draw and design, a kitchen for cooking, and a small garden. The garden does not need to be big; it just needs to let me feel close to nature.",
        tags: ["accommodation", "dream-home", "design", "garden"],
        relatedQuestions: [
          "What would your ideal home be like?",
          "Do you like houses with gardens?",
          "How important is interior design to a home?"
        ]
      }
    ]
  },
  {
    slug: "weather",
    order: 5,
    zhTitle: "天气",
    enTitle: "Weather",
    zhSummary: "她最喜欢春天，因为温和、有生命力；雨天则让她更想待在家。",
    enSummary:
      "She likes spring most because it is mild and lively, while rainy days make her want to stay home.",
    zhContent:
      "至于天气，我最喜欢的季节是春天。天气通常温和舒服，万物开始复苏。我在春天会感觉更有活力，所以更愿意出门享受大自然。但说实话，我不太喜欢雨天。下雨的时候，我通常更想待在家睡觉，或者只是放松一下。",
    enContent:
      "My favourite season is spring because the weather is mild, not too cold and not too hot. Spring gives me a feeling of a fresh start. Trees begin to grow, flowers bloom, and people also seem to feel lighter. In spring, I am more willing to go outside, for example, to take a walk, go cycling, or simply enjoy the sunshine. Weather really affects my mood. If it is sunny, I feel more motivated. On the other hand, I do not really like rainy days. Although “rain” is part of my Chinese name, in real life rain makes me feel sleepy and lazy, and I do not want to go out. When it rains, I usually prefer staying at home, sleeping, reading, or just relaxing.",
    tags: ["weather", "spring", "mood", "routine", "lifestyle"],
    relatedQuestions: [
      "What kind of weather do you like?",
      "Do you like rainy days?",
      "What do you usually do in spring?",
      "Does weather affect people's mood?"
    ],
    children: [
      {
        slug: "spring",
        zhTitle: "喜欢春天",
        enTitle: "Why I like spring",
        zhSummary: "春天温和舒服，让她更有活力，也更愿意出门。",
        enSummary:
          "Spring is mild and comfortable, making her feel more energetic and willing to go out.",
        zhContent:
          "春天对我来说是最舒服的季节。天气不会让人有负担，外面的颜色也开始变丰富。我会觉得自己从冬天那种比较沉闷的状态里走出来，更愿意和自然接触。",
        enContent:
          "Spring is the most comfortable season for me. The weather does not feel heavy, and the colors outside become richer. I feel as if I am coming out of the dull winter mood, and I become more willing to connect with nature.",
        tags: ["weather", "spring", "nature", "mood"],
        relatedQuestions: [
          "What is your favourite season?",
          "What do you like to do in spring?",
          "Do you prefer hot or cold weather?"
        ]
      },
      {
        slug: "rainy-days",
        zhTitle: "雨天的状态",
        enTitle: "How rainy days affect me",
        zhSummary: "雨天让她想休息、睡觉或者留在家里。",
        enSummary:
          "Rainy days make her want to rest, sleep, or stay at home.",
        zhContent:
          "我不算特别讨厌雨天，但雨天会让我明显变懒。路面湿、出门麻烦，人的情绪也容易低一点。所以如果没有必须做的事情，我会更愿意待在家里，睡觉或者看点轻松的内容。",
        enContent:
          "I do not exactly hate rainy days, but they do make me lazy. The roads are wet, going out becomes inconvenient, and my mood can become lower. So if I do not have anything urgent to do, I prefer staying at home, sleeping, or watching something relaxing.",
        tags: ["weather", "rain", "mood", "home"],
        relatedQuestions: [
          "Do you like rainy days?",
          "What do you usually do when it rains?",
          "Does rain affect your plans?"
        ]
      },
      {
        slug: "weather-and-mood",
        zhTitle: "天气影响心情",
        enTitle: "Weather and mood",
        zhSummary: "阳光会提升行动力，阴雨天更适合放慢节奏。",
        enSummary:
          "Sunshine increases her motivation, while gloomy weather makes her slow down.",
        zhContent:
          "我发现天气会很直接地影响我的效率。天气好的时候，我更容易开始学习或者出门；天气阴沉的时候，我会更想拖延。不过我也觉得阴雨天不一定完全不好，它适合放慢节奏，整理房间或者整理想法。",
        enContent:
          "I find that weather directly affects my productivity. When the weather is good, it is easier for me to start studying or go out. When it is gloomy, I tend to procrastinate. But I do not think rainy weather is completely bad. It is suitable for slowing down, tidying my room, or organizing my thoughts.",
        tags: ["weather", "mood", "productivity", "reflection"],
        relatedQuestions: [
          "Does weather affect your mood?",
          "Do people work differently in different weather?",
          "What weather is best for studying?"
        ]
      }
    ]
  },
  {
    slug: "daily-routine",
    order: 6,
    zhTitle: "日常作息",
    enTitle: "Daily Routine",
    zhSummary: "她是偏晚睡型学生，作息受课程影响，晚上是最属于自己的时间。",
    enSummary:
      "She is more of a night person whose routine depends on classes, and evening feels most personal to her.",
    zhContent:
      "因为我现在还是一名学生，所以我的作息会受到课程影响。上学的时候，我经常早上八点上课，所以通常会在七点二十左右起床。但是如果可以自己选择的话，我会选择中午十二点再起床，因为我是一个晚睡型的人。\n\n我最近最固定的习惯是打开 GPT，把我的想法告诉它，然后让它给我一些反馈和内容。我觉得 AI 真的非常好用，它可以帮助我整理想法，也可以把一些模糊的灵感变得更清楚。\n\n我的作息不算特别规律，但也不是完全混乱。如果我可以自由安排时间，我会很晚起床；但如果我有课或者有重要的事情，我也会准时完成。所以我觉得自己是一个不太规律，但在必要时可以自律的人。\n\n我最喜欢一天中的晚上，因为我觉得这段时间真正属于我。到了晚上，世界会变得很安静，我可以专注做自己的事情。如果我有空闲时间，我会思考日常生活中的需求，并且使用 AI 工具把这些想法做成小网站或者小 app。当我看到一个产品真的被做出来，并且能在日常生活中帮助到我时，我会非常有成就感。",
    enContent:
      "As a student, my daily routine is largely influenced by my classes. If I have an 8 a.m. class, I usually get up around 7:20, quickly wash up, eat something, or go straight to class. But if I could choose freely, I might wake up around noon because I am more of a night person. Evening is the most comfortable time of the day for me. There are fewer distractions, and I can finally do my own things, such as organizing my portfolio, reading, watching films, or opening GPT to explain and organize my thoughts. My routine is not extremely regular, and I am not self-disciplined every single day. But when I have a clear task or deadline, I can still push myself into a productive state. My ideal routine would be flexible but not completely out of control.",
    tags: ["routine", "student-life", "night-person", "self-discipline", "ai-tools"],
    relatedQuestions: [
      "What is your daily routine like?",
      "Are you a morning person or a night person?",
      "What is your favourite time of day?",
      "Do you think having a routine is important?"
    ],
    children: [
      {
        slug: "class-schedule",
        zhTitle: "受课程影响的作息",
        enTitle: "Routine shaped by classes",
        zhSummary: "有早课时会早起，但自由时更倾向晚睡晚起。",
        enSummary:
          "She gets up early for morning classes, but naturally prefers sleeping late and waking late.",
        zhContent:
          "我的作息不是固定模板，而是跟课程走。有早课的时候我可以早起，但这不是我最自然的状态。如果没有课，我会更愿意晚一点起，因为我的精力通常在晚上更好。",
        enContent:
          "My routine is not fixed; it follows my class schedule. When I have morning classes, I can get up early, but that is not my natural state. If I do not have classes, I prefer waking up later because I usually feel more energetic at night.",
        tags: ["routine", "student-life", "schedule"],
        relatedQuestions: [
          "What time do you usually get up?",
          "Is your daily routine regular?",
          "Do students have busy schedules?"
        ]
      },
      {
        slug: "evening-time",
        zhTitle: "晚上属于自己",
        enTitle: "Evening as personal time",
        zhSummary: "晚上外界干扰少，适合做作品集、阅读和思考。",
        enSummary:
          "Evening has fewer distractions and is suitable for portfolio work, reading, and thinking.",
        zhContent:
          "我最喜欢晚上，因为那段时间真正属于我。白天可能有课程、消息和各种杂事，但晚上安静下来以后，我更容易进入自己的节奏。我会做作品集、看书，或者只是整理一天的想法。",
        enContent:
          "My favourite time of day is the evening because it feels like time that truly belongs to me. During the day, there may be classes, messages, and small tasks. But when the evening becomes quiet, I can get into my own rhythm. I may work on my portfolio, read, or simply organize my thoughts.",
        tags: ["routine", "evening", "reflection", "portfolio"],
        relatedQuestions: [
          "What is your favourite time of day?",
          "What do you usually do in the evening?",
          "Do you prefer working during the day or at night?"
        ]
      },
      {
        slug: "thinking-with-tools",
        zhTitle: "用工具整理想法",
        enTitle: "Using tools to organize thoughts",
        zhSummary: "她常用 GPT 辅助表达和整理思路，但核心仍是自己的真实想法。",
        enSummary:
          "She uses GPT to organize expression and thoughts, while keeping her own real ideas at the center.",
        zhContent:
          "最近我的一个固定习惯是打开 GPT，把一些还不清楚的想法讲出来。它对我来说不是替我思考，而是帮助我把混乱的内容整理得更清晰。尤其准备作品集和口语时，这个过程很有帮助。",
        enContent:
          "Recently, one of my regular habits is opening GPT and explaining thoughts that are still unclear. For me, it does not replace my thinking. It helps me make messy ideas clearer. This is especially useful when I prepare my portfolio or speaking materials.",
        tags: ["routine", "ai-tools", "study", "reflection"],
        relatedQuestions: [
          "Do you use technology in your daily life?",
          "How do you organize your thoughts?",
          "Can technology help students study better?"
        ]
      }
    ]
  },
  {
    slug: "friends",
    order: 7,
    zhTitle: "朋友",
    enTitle: "Friends",
    zhSummary: "她朋友不少，但真正亲密的是少数；更喜欢线下见面而不是微信闲聊。",
    enSummary:
      "She has many friends but only a few close ones, and she prefers meeting in person to casual WeChat chatting.",
    zhContent:
      "说实话，我有很多朋友，但不是每一个朋友都很亲密。我有固定几个非常亲密的朋友，我会和他们说一些比较交心的话。除此之外，我也有一些不那么亲密的朋友，我们可能有共同的爱好，所以当我们想做这些事情的时候，就会一起玩。\n\n我不太喜欢在微信上闲聊，所以我通常更喜欢和朋友线下见面，然后一起做一些共同感兴趣的事情，比如骑行、吃饭或者喝咖啡。我觉得一起做事情比单纯线上聊天更自然，也更舒服。\n\n我认为朋友最重要的品质是真诚和可靠。真正好的朋友不需要每天联系，但关系依然稳定。当我遇到问题的时候，他们可以提醒我，但不会过多干扰我的私人生活。因为我是一个比较自我的人，不太喜欢别人把他们的想法强加在我身上。\n\n我有很多长期保持联系的朋友。因为我不太喜欢微信聊天，所以我们通常会通过互相赠送生日礼物，或者偶尔见面的方式来保持联系。虽然我们不经常见面，但每次见面都不会觉得尴尬。我觉得这才是真正舒服的友谊。",
    enContent:
      "I have quite a few friends, but only a few of them are really close to me. I am not the kind of person who enjoys constant casual chatting on WeChat, because online conversations can feel fragmented and not always meaningful. I prefer meeting friends in person, for example, cycling together, eating out, having coffee, or cooking at home and chatting. For me, the most important qualities in a friend are sincerity and reliability. Good friends do not have to contact each other every day, but the relationship should feel stable. Even if we meet after some time, it does not feel awkward. I really value relationships where we understand each other without too much explanation.",
    tags: ["friendship", "offline", "trust", "lifestyle", "communication"],
    relatedQuestions: [
      "Do you have many friends?",
      "How do you keep in touch with friends?",
      "What qualities are important in a friend?",
      "Do you prefer meeting friends online or offline?"
    ],
    children: [
      {
        slug: "close-friends",
        zhTitle: "真正亲密的朋友",
        enTitle: "Really close friends",
        zhSummary: "朋友很多不等于都亲密，稳定和信任更重要。",
        enSummary:
          "Having many friends does not mean all are close; stability and trust matter more.",
        zhContent:
          "我觉得朋友的数量不是最重要的。真正亲密的朋友可能只有几个，但他们会让我觉得安全和被理解。这种关系不需要每天证明，却一直在那里。",
        enContent:
          "I do not think the number of friends is the most important thing. Truly close friends may only be a few people, but they make me feel safe and understood. This kind of relationship does not need to be proved every day, but it is always there.",
        tags: ["friendship", "trust", "close-friends"],
        relatedQuestions: [
          "Do you have many close friends?",
          "What makes a friendship strong?",
          "Is it better to have many friends or a few close friends?"
        ]
      },
      {
        slug: "offline-meetings",
        zhTitle: "线下见面更舒服",
        enTitle: "Meeting in person feels better",
        zhSummary: "线下活动让交流更真实，比如骑行、吃饭和喝咖啡。",
        enSummary:
          "Offline activities make communication feel more real, such as cycling, eating, and coffee.",
        zhContent:
          "比起微信闲聊，我更喜欢和朋友面对面相处。一起做一件事情的时候，聊天会自然很多。比如骑行、吃饭、喝咖啡，这些活动本身就会创造共同记忆。",
        enContent:
          "Compared with casual chatting on WeChat, I prefer spending time with friends face to face. When we do something together, conversation becomes much more natural. Activities like cycling, eating out, or having coffee can create shared memories.",
        tags: ["friendship", "offline", "communication", "social"],
        relatedQuestions: [
          "How do you usually spend time with friends?",
          "Do you prefer online or face-to-face communication?",
          "What do young people do with friends in your country?"
        ]
      },
      {
        slug: "sincere-reliable",
        zhTitle: "真诚和可靠",
        enTitle: "Sincerity and reliability",
        zhSummary: "她最看重朋友的真诚、稳定和关键时刻的可靠。",
        enSummary:
          "She values sincerity, stability, and reliability in important moments.",
        zhContent:
          "我最看重朋友是否真诚和可靠。真诚意味着不用总是包装自己，可靠则意味着在重要时候可以信任对方。我不太喜欢表面热闹但没有真实连接的关系。",
        enContent:
          "What I value most in a friend is sincerity and reliability. Sincerity means we do not have to pretend too much, and reliability means I can trust the person when it matters. I do not really like relationships that look lively on the surface but lack real connection.",
        tags: ["friendship", "sincerity", "reliability", "trust"],
        relatedQuestions: [
          "What qualities are important in a friend?",
          "How can people maintain friendships?",
          "Why do some friendships last a long time?"
        ]
      }
    ]
  },
  {
    slug: "music",
    order: 8,
    zhTitle: "音乐",
    enTitle: "Music",
    zhSummary: "她不是重度音乐爱好者，但喜欢蓝调和 Love Story，也会古筝。",
    enSummary:
      "She is not a heavy music listener, but she likes blues, Love Story, and can play the guzheng.",
    zhContent:
      "说实话，我并不是一个特别喜欢听音乐的人。我只是非常偶尔听音乐，而且没有固定的听音乐时间。有时候在睡觉前，我会突然想听某一首歌，然后打开音乐软件去听它。\n\n我比较喜欢蓝调歌曲，因为我觉得它们的旋律通常非常有趣。我最喜欢的歌手是 Taylor Swift，我很喜欢她的歌《Love Story》，因为这首歌很好听，也很容易让人记住。\n\n音乐确实会影响我的心情，但对我来说不一定总是积极的。和很多人不一样，有时候听音乐会让我更烦，因为它会打扰我的思路。我是一个喜欢思考的人，所以背景音乐有时会影响我的专注。当然，如果我在放松的时候听到一些好听的歌，我也会觉得很开心。\n\n我唱歌非常难听，但是我会一种乐器，就是古筝。那是我小时候父母送我去学的，不过学习古筝的过程对我来说比较痛苦。\n\n我更喜欢用耳机听音乐。我曾经试过去现场听音乐，虽然现场气氛很有感染力，但是太大的音响会让我觉得不舒服，所以相比之下，我更喜欢自己安静地用耳机听音乐。",
    enContent:
      "I am not someone who has to listen to music every day. I only listen to it occasionally. Instead of using music as background noise all the time, I prefer listening to it properly when I really want to. I like blues because the melodies and rhythms have a special flavor, and I also like Taylor Swift's Love Story because it has a strong sense of story. Music can affect my mood, but for me it is not always positive. Sometimes when I am thinking or designing, music interrupts my thoughts. I learned the guzheng when I was a child, so I can play it a little, but honestly, the learning process was quite painful because it required repeated practice and discipline. Now I prefer listening to music quietly with headphones as a short break.",
    tags: ["music", "blues", "guzheng", "relaxation", "mood"],
    relatedQuestions: [
      "Do you like music?",
      "What kind of music do you like?",
      "Can you play any musical instruments?",
      "Do you prefer listening to music alone or with others?"
    ],
    children: [
      {
        slug: "occasional-listener",
        zhTitle: "偶尔听音乐",
        enTitle: "Listening occasionally",
        zhSummary: "她不会一直听音乐，更喜欢在真正想听时认真听。",
        enSummary:
          "She does not listen to music constantly; she listens carefully when she wants to.",
        zhContent:
          "我听音乐的频率不算高，因为我很多时候需要安静地思考。如果音乐一直作为背景音，我反而会觉得有点吵。所以我更喜欢偶尔听，听的时候就认真享受。",
        enContent:
          "I do not listen to music very often because I need quiet time to think. If music is always playing in the background, I may find it a bit noisy. So I prefer listening occasionally, and when I do, I really enjoy it.",
        tags: ["music", "habit", "focus", "relaxation"],
        relatedQuestions: [
          "How often do you listen to music?",
          "Do you listen to music while studying?",
          "Do you prefer quiet places?"
        ]
      },
      {
        slug: "favorite-music",
        zhTitle: "喜欢蓝调和 Love Story",
        enTitle: "Blues and Love Story",
        zhSummary: "蓝调有旋律味道，Love Story 有故事感。",
        enSummary:
          "Blues has interesting melodies, while Love Story feels narrative and emotional.",
        zhContent:
          "我喜欢蓝调，是因为它的旋律不像流行歌那么直接，有一种特别的情绪。我也喜欢 Love Story，因为它旋律很容易记住，而且有一种浪漫故事的感觉。",
        enContent:
          "I like blues because its melodies are not as direct as ordinary pop songs, and it has a special mood. I also like Love Story because the melody is easy to remember, and it gives me a romantic storytelling feeling.",
        tags: ["music", "blues", "pop-music", "mood"],
        relatedQuestions: [
          "What kind of music do you like?",
          "What is your favourite song?",
          "Why do people like different kinds of music?"
        ]
      },
      {
        slug: "guzheng",
        zhTitle: "古筝经历",
        enTitle: "Guzheng experience",
        zhSummary: "她会弹古筝，但小时候练琴过程并不轻松。",
        enSummary:
          "She can play the guzheng, but practicing it as a child was not easy.",
        zhContent:
          "小时候学古筝让我体验到传统乐器的美，但练习过程也真的挺痛苦。它需要反复练基本功，也需要耐心。现在回头看，这段经历让我更理解坚持和练习的意义。",
        enContent:
          "Learning the guzheng as a child helped me experience the beauty of a traditional instrument, but the practice was honestly quite painful. It required repeated basic training and patience. Looking back, this experience helped me understand the value of persistence and practice.",
        tags: ["music", "guzheng", "childhood", "discipline"],
        relatedQuestions: [
          "Can you play any musical instruments?",
          "Is it difficult to learn an instrument?",
          "Should children learn music?"
        ]
      }
    ]
  },
  {
    slug: "movies",
    order: 9,
    zhTitle: "电影",
    enTitle: "Movies & Films",
    zhSummary: "她喜欢爱情片、科幻片和喜剧，最喜欢《穿普拉达的女王》。",
    enSummary:
      "She enjoys romance, science fiction, and comedies, and her favorite film is The Devil Wears Prada.",
    zhContent:
      "我非常喜欢看电影。以前我经常看电影，但是最近因为我正在申请硕士，所以没有办法像以前一样经常看，现在只是偶尔看。\n\n我喜欢看爱情片、科幻片和一些喜剧。爱情片和喜剧可以让我真正放松，而科幻片有时候会带给我一些新的思考。我觉得电影不仅是一种娱乐方式，也可以让我看到不同的世界。\n\n我最喜欢的电影是《穿普拉达的女王》。它讲的是一个女生进入时尚行业工作，不断成长，最后发现并追寻自己真正热爱的事情。我觉得这部电影很励志。所以当我知道它的第二部要上映的时候，我非常开心。\n\n我更喜欢和家人一起看电影。随着年龄增长，我和父母之间偶尔会有一些代沟，但是当我们一起看电影的时候，我们可以安静地待在一起，享受亲子时光。看完电影之后，我们也可以交流一些电影里的情节，这或许能让我们之间的代沟变小，所以我很喜欢和家人一起看电影。\n\n我也很喜欢看英文电影。因为我现在正在学习英语，看英文电影对我的英语提升有很大帮助。当然，电影也能让我看到一些我没有体验过的不同人生，我觉得这非常有趣。",
    enContent:
      "I really like watching films, although recently I have watched fewer because I am preparing for my master's application and organizing my portfolio. I enjoy romance films, science fiction, and comedies because they give me emotion, imagination, and relaxation. My favorite film is The Devil Wears Prada. On the surface, it is about the fashion industry, but what I like more is its theme of growth and choices. The main character tries hard to adapt to a glamorous but stressful environment, and later she gradually realizes what she really wants. I think this is similar to young people trying to find their career direction. I also like watching films with my family because films give us something to talk about and help reduce the generation gap. English films are also useful for me because they help me learn more natural expressions.",
    tags: ["movies", "films", "family", "english-learning", "growth"],
    relatedQuestions: [
      "Do you like watching films?",
      "What kinds of films do you like?",
      "Do you prefer watching films alone or with others?",
      "What is your favourite film?"
    ],
    children: [
      {
        slug: "favorite-film",
        zhTitle: "《穿普拉达的女王》",
        enTitle: "The Devil Wears Prada",
        zhSummary: "她喜欢这部电影关于成长、职业和自我选择的主题。",
        enSummary:
          "She likes the film's themes of growth, career pressure, and personal choice.",
        zhContent:
          "我喜欢《穿普拉达的女王》，不是只因为它好看或者时尚，而是因为它讲了一个人在职业压力中慢慢认识自己的过程。这个主题对我现在申请和转专业也挺有共鸣。",
        enContent:
          "I like The Devil Wears Prada not only because it is stylish and enjoyable, but because it shows how a person gradually understands herself under career pressure. This theme resonates with me now because I am also applying for further study and shifting my direction.",
        tags: ["movies", "growth", "career", "favorite-film"],
        relatedQuestions: [
          "What is your favourite film?",
          "Why do you like this film?",
          "Can films influence people's choices?"
        ]
      },
      {
        slug: "family-movies",
        zhTitle: "和家人看电影",
        enTitle: "Watching films with family",
        zhSummary: "电影能给家人提供共同话题，减少代沟。",
        enSummary:
          "Films provide shared topics for family members and help reduce the generation gap.",
        zhContent:
          "我喜欢和家人一起看电影，因为看完以后可以讨论剧情、角色或者价值观。很多时候，电影比直接聊天更容易开启交流，也能让我更了解父母的想法。",
        enContent:
          "I like watching films with my family because after the film, we can discuss the story, characters, or values. Sometimes a film starts a conversation more easily than direct talking, and it also helps me understand my parents' thoughts better.",
        tags: ["movies", "family", "communication"],
        relatedQuestions: [
          "Do you watch films with your family?",
          "How do families spend time together?",
          "Can films bring people closer?"
        ]
      },
      {
        slug: "english-films",
        zhTitle: "英文电影学表达",
        enTitle: "Learning expressions from English films",
        zhSummary: "英文电影能帮助她熟悉自然口语和语感。",
        enSummary:
          "English films help her become familiar with natural spoken expressions.",
        zhContent:
          "看英文电影对我学英语挺有帮助，尤其是口语表达。课本里的句子有时比较正式，但电影里的表达更接近日常交流。我不一定会刻意背台词，但会慢慢熟悉语气和节奏。",
        enContent:
          "Watching English films helps me with English learning, especially spoken expressions. Sentences in textbooks can be formal, but expressions in films are closer to daily communication. I do not always memorize lines on purpose, but I gradually become familiar with tone and rhythm.",
        tags: ["movies", "english-learning", "speaking", "language"],
        relatedQuestions: [
          "Do you watch films in English?",
          "Can films help people learn languages?",
          "What is a good way to improve speaking?"
        ]
      }
    ]
  },
  {
    slug: "sports",
    order: 10,
    zhTitle: "运动",
    enTitle: "Sports & Exercise",
    zhSummary: "她知道运动重要，但不算特别自律；喜欢羽毛球、游泳，也想尝试攀岩和网球。",
    enSummary:
      "She knows exercise is important but is not very self-disciplined; she likes badminton and swimming and wants to try climbing and tennis.",
    zhContent:
      "说实话，我知道运动很好，但我不是一个特别自律、特别爱动的人，所以我只是偶尔运动。\n\n我喜欢很多球类运动，比如羽毛球，也喜欢游泳。我更喜欢和朋友一起运动，因为这是一种很好的社交方式。我们可以一边运动，一边放松和交流。\n\n最近说到运动有点让我尴尬，因为我最近学习压力比较大，所以没有坚持运动。小时候我非常喜欢运动，和现在不太一样。可能我一直都喜欢运动，只是小时候时间更多，压力更小。\n\n我认为运动有很多好处。它可以帮助人放松、保持健康，也可以成为一种很好的社交方式。\n\n我还想尝试很多新的运动，比如攀岩和网球。攀岩看起来很有挑战性，网球看起来很好玩，而且网球服也很好看。\n\n我喜欢看体育比赛，因为其实我很热爱运动。只是我自己没有经常运动，是因为我有点懒，也很难坚持规律的运动习惯。",
    enContent:
      "I know exercise is good for both physical health and mood, but I am not a very self-disciplined person, so my exercise routine is not stable. I like badminton and swimming because they do not feel boring to me. Badminton is suitable for playing with friends. It has interaction and a little competition. Swimming feels more like a process of emptying my mind. I also want to try rock climbing and tennis because they look challenging and social. Recently, because of study and application pressure, I have not exercised regularly, which I feel a bit sorry about. For me, exercising with friends is easier to maintain because it is not just exercise, but also a way to meet and communicate.",
    tags: ["sports", "exercise", "badminton", "swimming", "self-discipline"],
    relatedQuestions: [
      "Do you like sports?",
      "What sports do you like?",
      "Do you prefer exercising alone or with friends?",
      "How often do you exercise?"
    ],
    children: [
      {
        slug: "badminton-swimming",
        zhTitle: "羽毛球和游泳",
        enTitle: "Badminton and swimming",
        zhSummary: "羽毛球有互动，游泳更适合放空和放松。",
        enSummary:
          "Badminton is interactive, while swimming helps her relax and clear her mind.",
        zhContent:
          "羽毛球和游泳是我比较喜欢的运动。羽毛球适合和朋友打，有来有回，不会太无聊。游泳则比较安静，人在水里的时候会暂时和外界隔开，我觉得很放松。",
        enContent:
          "Badminton and swimming are two sports I like. Badminton is good for playing with friends because it is interactive and not boring. Swimming is quieter. When I am in the water, I feel temporarily separated from the outside world, which is relaxing.",
        tags: ["sports", "badminton", "swimming", "relaxation"],
        relatedQuestions: [
          "What sports do you like?",
          "Is swimming popular in your country?",
          "Do you like team sports or individual sports?"
        ]
      },
      {
        slug: "try-new-sports",
        zhTitle: "想尝试攀岩和网球",
        enTitle: "Wanting to try climbing and tennis",
        zhSummary: "她想尝试更有挑战、更有社交感的运动。",
        enSummary:
          "She wants to try sports that feel challenging and social.",
        zhContent:
          "我对攀岩和网球挺感兴趣。攀岩看起来需要力量、判断和一点勇气；网球则有一种很优雅但也很有运动量的感觉。我希望以后有时间可以认真学一下。",
        enContent:
          "I am quite interested in rock climbing and tennis. Climbing seems to require strength, judgment, and a bit of courage. Tennis feels elegant but also physically demanding. I hope I can learn them properly when I have time.",
        tags: ["sports", "climbing", "tennis", "challenge"],
        relatedQuestions: [
          "Is there any sport you want to try?",
          "Why do people try new sports?",
          "Are challenging sports popular among young people?"
        ]
      },
      {
        slug: "exercise-with-friends",
        zhTitle: "和朋友一起运动",
        enTitle: "Exercising with friends",
        zhSummary: "朋友陪伴能让运动更容易坚持，也更像社交活动。",
        enSummary:
          "Friends make exercise easier to maintain and turn it into a social activity.",
        zhContent:
          "我一个人运动时比较容易放弃，但和朋友一起就会好很多。因为这时候运动不只是完成任务，而是一起做一件事。它既能锻炼身体，也能维持友谊。",
        enContent:
          "When I exercise alone, I give up more easily. But with friends, it becomes much better. Exercise is no longer just a task; it becomes something we do together. It helps me stay healthy and maintain friendships at the same time.",
        tags: ["sports", "friendship", "social", "self-discipline"],
        relatedQuestions: [
          "Do you prefer exercising alone or with friends?",
          "How can people keep exercising regularly?",
          "Can sports help people make friends?"
        ]
      }
    ]
  },
  {
    slug: "reading",
    order: 11,
    zhTitle: "阅读",
    enTitle: "Reading",
    zhSummary: "她喜欢阅读，从完整书籍扩展到论文、长文和专业内容，更偏好电子书。",
    enSummary:
      "She enjoys reading, from complete books to papers, long articles, and professional content, and she prefers e-books.",
    zhContent:
      "我很喜欢阅读，甚至在我申请硕士的作品集里，我还放了一个关于阅读产品的设计项目。尽管最近我很忙，但我仍然保持着阅读的习惯，只是我的阅读方式发生了变化。\n\n以前我更喜欢阅读完整的书籍，但现在我更常阅读一些论文、公众号文章、社交媒体长文或者专业相关的内容。我觉得这种阅读方式更适合我现在的生活节奏，也更方便我快速获取信息和灵感。\n\n相比纸质书，我更喜欢电子书，因为它携带起来非常方便。我可以利用一些碎片化时间完成阅读，比如在路上、休息的时候，或者临睡前看一会儿。\n\n我小时候就很喜欢阅读，和现在差不多。最近我在读的一本书叫《建筑师的20岁》。它是一本关于建筑大师青年时期成长经历的访谈集，给年轻建筑师提供了很多指引。虽然我现在已经决定未来不做建筑师了，但这本书依然给了我很多帮助，因为我认为设计都是相通的。\n\n阅读对我来说很有作用。它既能帮助我放松，也能给我灵感，还可以提升我的专业能力。我更喜欢在床上阅读，因为这个时候我的身体足够放松，反而能让我的大脑更好地思考。\n\n我认为现在的人不会像以前一样阅读了。因为以前没有手机、网络和 AI，人们更可能完整地阅读一本书。但是现在是信息大爆炸的时代，人们可能更倾向于碎片化阅读，或者阅读一些已经被整理好的内容。",
    enContent:
      "I really like reading, but the way I read now is different from before. In the past, I preferred complete books, following the author's logic from beginning to end. Now, because of study and application needs, I more often read papers, WeChat articles, long social media posts, and professional content related to design, architecture, and product experience. I prefer e-books because they are portable and suitable for fragmented time. For example, when I am waiting or taking a break, I can read a little on my Kindle or phone. Recently, I have been reading Architects in Their Twenties. Although I may not become an architect in the future, many parts about design, growth, and career choices still inspire me. For me, reading is not just getting information; it is also like having a conversation with other people's experiences.",
    tags: ["reading", "ebooks", "design", "growth", "study"],
    relatedQuestions: [
      "Do you like reading?",
      "Do you prefer paper books or e-books?",
      "What book are you reading recently?",
      "Why do people read less nowadays?"
    ],
    children: [
      {
        slug: "reading-change",
        zhTitle: "阅读内容的变化",
        enTitle: "How my reading changed",
        zhSummary: "她从读完整书，变成更多阅读专业内容和长文。",
        enSummary:
          "She moved from complete books to more professional content and long articles.",
        zhContent:
          "以前我读书更追求完整性，现在更追求和当前问题相关。比如做作品集时，我会读设计案例、研究文章和一些专业讨论。这种阅读更碎片化，但也更直接地服务于我的思考。",
        enContent:
          "In the past, I cared more about reading complete books. Now I care more about whether the reading is related to my current questions. For example, when working on my portfolio, I read design cases, research articles, and professional discussions. This kind of reading is more fragmented, but it supports my thinking more directly.",
        tags: ["reading", "study", "design", "professional-content"],
        relatedQuestions: [
          "What do you usually read?",
          "Has your reading habit changed?",
          "Do students read many academic articles?"
        ]
      },
      {
        slug: "ebooks",
        zhTitle: "电子书和碎片时间",
        enTitle: "E-books and fragmented time",
        zhSummary: "电子书方便携带，适合随时读一点。",
        enSummary:
          "E-books are portable and suitable for reading in short moments.",
        zhContent:
          "我更喜欢电子书，因为它很方便。纸质书有氛围，但不适合一直带着。电子书让我可以在零碎时间读一点，比如通勤、等待或者睡前。",
        enContent:
          "I prefer e-books because they are convenient. Paper books have a nice atmosphere, but they are not easy to carry all the time. E-books allow me to read during small pockets of time, such as commuting, waiting, or before sleep.",
        tags: ["reading", "ebooks", "lifestyle", "technology"],
        relatedQuestions: [
          "Do you prefer paper books or e-books?",
          "Are e-books popular?",
          "How has technology changed reading?"
        ]
      },
      {
        slug: "architects-in-twenties",
        zhTitle: "《建筑师的20岁》",
        enTitle: "Architects in Their Twenties",
        zhSummary: "这本书给她关于设计、成长和职业选择的启发。",
        enSummary:
          "This book inspires her thinking about design, growth, and career choices.",
        zhContent:
          "最近我在读《建筑师的20岁》。虽然我不一定继续做建筑师，但我喜欢看不同设计师年轻时的困惑和选择。它让我觉得职业道路不是一次决定好的，而是在不断尝试中慢慢清晰的。",
        enContent:
          "Recently, I have been reading Architects in Their Twenties. Although I may not continue as an architect, I like reading about young designers' confusion and choices. It makes me feel that a career path is not decided once and for all; it becomes clearer through trying and reflecting.",
        tags: ["reading", "architecture", "growth", "career"],
        relatedQuestions: [
          "What book are you reading recently?",
          "Do books influence your thinking?",
          "What kind of books are useful for young people?"
        ]
      }
    ]
  },
  {
    slug: "shopping",
    order: 12,
    zhTitle: "购物",
    enTitle: "Shopping",
    zhSummary: "她喜欢购物，也会冲动消费；购物既是放松，也是对未来生活的期待。",
    enSummary:
      "She enjoys shopping and can be impulsive; shopping is both relaxation and expectation for her future life.",
    zhContent:
      "我很喜欢购物，而且我经常购物，并不是只有真正需要的时候才会买东西。不过我也知道这并不是一个特别好的习惯，因为它会在一定程度上造成浪费。\n\n线上购物和线下购物我都很喜欢，我会根据不同的产品选择不同的购物方式。因为我现在大部分时间都在学校生活，所以我的很多东西都需要自己购买。\n\n说实话，我购物的时候比较随心所欲，也经常冲动消费。只要一个产品有某个点打动我，我就很容易想要购买它。有时候我不会考虑得特别周全，只是被当下的感觉吸引。\n\n我曾经冲动购买过一条很华丽的裙子，但是后来发现自己没有任何合适的场合去穿它。而且当时我还以为自己会减肥，所以买了小一号。结果因为学习压力比较大，我反而变胖了，这条裙子就再也穿不上了。\n\n我认为购物对我来说是一种放松方式。购物的时候，我会对未来产生一种期待，会想象这些东西被运用到我生活中的场景会是什么样子。这种想象会让我对未来更有动力。\n\n我最近买过一件非常让我满意的东西，是一本书，叫《建筑师的20岁》。它不仅和我的专业背景有关，也给了我很多关于设计和成长的启发。",
    enContent:
      "I like shopping, and I shop quite often. Sometimes I can be impulsive, especially when I see something beautiful that matches an imagined lifestyle. For me, shopping is not only about buying things; it is also a way to relax. It gives me a sense of expectation for my future life. For example, when I buy a book, a cup, or a piece of clothing, I imagine how I will use it. Of course, impulsive shopping can also lead to regret. I once bought a very gorgeous dress because it looked beautiful, but later I found that I had no suitable occasion to wear it, and it was also too small. Recently, the most satisfying thing I bought was Architects in Their Twenties, because it did not just bring short-term happiness. It actually gave me inspiration.",
    tags: ["shopping", "lifestyle", "impulse", "relaxation", "consumption"],
    relatedQuestions: [
      "Do you like shopping?",
      "Do you prefer online or offline shopping?",
      "Have you ever bought something impulsively?",
      "Why do some people enjoy shopping?"
    ],
    children: [
      {
        slug: "relaxation",
        zhTitle: "购物带来的期待",
        enTitle: "Expectation from shopping",
        zhSummary: "购物让她想象未来生活，也带来短暂放松。",
        enSummary:
          "Shopping lets her imagine her future life and brings short-term relaxation.",
        zhContent:
          "我喜欢购物的一个原因是它会带来期待感。买东西的时候，我不只是看物品本身，也会想象它进入我生活后的样子。这种想象有时候会让我很放松。",
        enContent:
          "One reason I like shopping is that it gives me expectation. When I buy something, I do not only look at the item itself. I also imagine how it will become part of my life. This kind of imagination can be relaxing.",
        tags: ["shopping", "lifestyle", "relaxation"],
        relatedQuestions: [
          "Why do you like shopping?",
          "Does shopping make people happy?",
          "What do people usually buy for relaxation?"
        ]
      },
      {
        slug: "impulse-dress",
        zhTitle: "冲动买裙子",
        enTitle: "Impulsive dress purchase",
        zhSummary: "她曾买过华丽但不实用、也不合身的裙子。",
        enSummary:
          "She once bought a gorgeous dress that was impractical and too small.",
        zhContent:
          "我曾经冲动买过一条很华丽的裙子。当时觉得它特别漂亮，好像能代表某种理想生活。但买回来以后发现没有场合穿，而且还小了。这个经历让我意识到漂亮不等于适合。",
        enContent:
          "I once bought a very gorgeous dress impulsively. At that moment, I thought it was beautiful and represented an ideal lifestyle. But after buying it, I realized I had no occasion to wear it, and it was too small. This experience taught me that beautiful does not always mean suitable.",
        tags: ["shopping", "impulse", "clothing", "lesson"],
        relatedQuestions: [
          "Have you ever bought something impulsively?",
          "Do you often regret buying things?",
          "How can people avoid impulsive shopping?"
        ]
      },
      {
        slug: "satisfying-book",
        zhTitle: "最满意的购物是书",
        enTitle: "A satisfying book purchase",
        zhSummary: "买书带来的满足更持久，因为它提供了真实启发。",
        enSummary:
          "Buying a book was more satisfying because it brought lasting inspiration.",
        zhContent:
          "最近最满意的购物是一本书，而不是衣服或者化妆品。因为书带来的快乐不是很短暂的，它会慢慢影响我的想法。尤其是和设计、成长有关的书，会让我觉得这笔钱花得很值得。",
        enContent:
          "Recently, my most satisfying purchase was a book, not clothes or cosmetics. The happiness from a book is not so short-lived; it slowly influences my thoughts. Especially when a book is related to design and growth, I feel the money is well spent.",
        tags: ["shopping", "reading", "growth", "value"],
        relatedQuestions: [
          "What was the last thing you bought?",
          "Do you like buying books?",
          "What makes a purchase worthwhile?"
        ]
      }
    ]
  },
  {
    slug: "food-cooking",
    order: 13,
    zhTitle: "食物与烹饪",
    enTitle: "Food & Cooking",
    zhSummary: "她喜欢尝试食物，最喜欢烤鸭，也喜欢做简餐和为朋友做饭。",
    enSummary:
      "She enjoys trying food, likes roast duck most, and enjoys making simple meals for herself and friends.",
    zhContent:
      "我喜欢各种类型的食物，这可能也是我不断长胖的原因。我总是很喜欢尝试新的食物，因为对我来说，食物不仅是为了填饱肚子，也是一种享受和放松的方式。\n\n我最喜欢的一道菜是烤鸭。因为我的家乡离北京很近，所以烤鸭对我来说是一道比较熟悉的菜。我的家乡也常常会做这道菜，而且通常只有在聚会、请客或者比较隆重的场合，我才会吃到它，所以它也是一道让我经常很期待的美食。\n\n我很喜欢自己做饭，但我更擅长做一些简餐。因为我不太喜欢中国做菜里的一些方式，比如炒菜，它会产生很大的油烟，这常常会让我觉得不舒服。所以相比复杂的中式烹饪，我更喜欢做简单、清爽一点的食物。\n\n我更喜欢在家吃饭，因为我本身很喜欢做饭。我觉得做饭的过程很放松，而且自己做饭可以根据自己的口味来调整，做出最符合自己胃口的东西。\n\n我认为健康饮食很重要，所以最近我常常自己做饭。当然，我也很喜欢去外面吃，因为有一些菜我自己做不出来。对我来说，自己做饭和外出就餐都有各自的乐趣：前者更健康、更自由，后者则能让我尝试更多不同的味道。",
    enContent:
      "I enjoy many kinds of food and like trying new flavors. One of my favorite dishes is roast duck because my hometown is close to Beijing, so roast duck feels both familiar and a little formal to me. It often appears at family gatherings or special occasions, so it is not just food; it also carries shared memories. I also like cooking, but I am better at simple and clean meals, such as breakfast, salad, pasta, or dishes that do not create too much smoke and oil. I do not really enjoy heavy stir-frying because the kitchen and my clothes smell afterward. For me, eating at home is healthier and more flexible because I can control the taste. Eating out allows me to try more flavors. Sometimes I invite friends to my home and cook for them, which feels like a warm way to socialize.",
    tags: ["food", "cooking", "roast-duck", "family", "lifestyle"],
    relatedQuestions: [
      "What is your favourite food?",
      "Do you like cooking?",
      "Do you prefer eating at home or eating out?",
      "Is food important in Chinese culture?"
    ],
    children: [
      {
        slug: "roast-duck",
        zhTitle: "烤鸭和家乡",
        enTitle: "Roast duck and hometown",
        zhSummary: "烤鸭因为靠近北京而熟悉，也常和聚会联系在一起。",
        enSummary:
          "Roast duck feels familiar because she lives near Beijing and connects it with gatherings.",
        zhContent:
          "烤鸭对我来说不只是北京特色，也和我的生活经验有关。因为廊坊离北京很近，烤鸭并不遥远。它常出现在家人聚会或者请客的时候，所以我会把它和热闹、正式的场合联系起来。",
        enContent:
          "For me, roast duck is not only a Beijing specialty; it is connected with my own life. Because Langfang is close to Beijing, roast duck does not feel distant. It often appears at family gatherings or when treating guests, so I connect it with lively and formal occasions.",
        tags: ["food", "roast-duck", "hometown", "family"],
        relatedQuestions: [
          "What is your favourite food?",
          "Is there any famous food near your hometown?",
          "What food do people eat on special occasions?"
        ]
      },
      {
        slug: "simple-cooking",
        zhTitle: "喜欢做简餐",
        enTitle: "Simple cooking",
        zhSummary: "她喜欢做简单、干净、油烟少的饭。",
        enSummary:
          "She enjoys making simple, clean meals with less smoke and oil.",
        zhContent:
          "我喜欢做饭，但不喜欢很复杂、油烟很大的菜。我更喜欢做一些简餐，比如意面、沙拉或者简单早餐。这样既有参与感，也不会让做饭变成很大的负担。",
        enContent:
          "I like cooking, but I do not enjoy very complicated dishes with heavy smoke and oil. I prefer making simple meals, such as pasta, salad, or breakfast. This gives me a sense of participation without making cooking feel like a heavy task.",
        tags: ["food", "cooking", "simple-meals", "health"],
        relatedQuestions: [
          "Do you like cooking?",
          "What can you cook?",
          "Do young people in your country cook often?"
        ]
      },
      {
        slug: "cook-for-friends",
        zhTitle: "给朋友做饭",
        enTitle: "Cooking for friends",
        zhSummary: "为朋友做饭是一种温暖、放松的社交方式。",
        enSummary:
          "Cooking for friends is a warm and relaxed way for her to socialize.",
        zhContent:
          "我有时候会邀请朋友来家里，然后做一点吃的。对我来说，这比在外面吃饭更有亲密感。大家在一个放松的环境里聊天，食物也会让关系变得更温暖。",
        enContent:
          "Sometimes I invite friends to my home and cook something for them. For me, this feels more intimate than eating outside. We can chat in a relaxed environment, and food makes the relationship feel warmer.",
        tags: ["food", "cooking", "friendship", "home"],
        relatedQuestions: [
          "Do you like eating with friends?",
          "Do you ever cook for others?",
          "Why do people enjoy sharing food?"
        ]
      }
    ]
  },
  {
    slug: "transportation",
    order: 14,
    zhTitle: "交通",
    enTitle: "Transportation",
    zhSummary: "她本地常走路或打车，去北京很方便，在北京则更倾向坐地铁。",
    enSummary:
      "She usually walks or takes taxis locally, can reach Beijing easily, and prefers the subway in Beijing.",
    zhContent:
      "我的交通方式通常只有两种：打车或者走路。因为在我的城市，如果坐公共交通，往往需要换乘，我会觉得比较麻烦。所以如果路程比较短，我就会选择走路；如果路程比较长，我就会选择打车，或者让我的爸妈送我。\n\n相比公共交通，我更喜欢私家车，因为它更加方便，也更加自由。我觉得交通确实会很影响我的日常生活。比如当我突然想和朋友见面的时候，我就会想，如果我有一辆自己的车就好了，这样我就可以自己开车去见朋友，不用依赖别人或者等车。\n\n我认为中国的高铁非常方便，尤其是对我来说。从我家到北京坐高铁只需要大约 21 分钟，所以去北京非常快。我也很喜欢长途旅行，如果是长途交通方式，我更喜欢坐飞机。因为北京大兴机场离我很近，虽然它叫北京大兴机场，但其实有一部分在廊坊附近，所以我坐飞机也很方便。\n\n我觉得廊坊本地的交通还可以，但我经常去北京玩，那里的交通真的很拥堵。所以如果是在北京，我会更倾向于坐地铁或者其他公共交通工具，因为在大城市里，公共交通有时候反而比开车更方便。\n\n我认为未来的交通会有很大的变化。比如无人驾驶会越来越普及，也会越来越方便；高铁可能也会变得更快。未来人们的出行方式应该会更加智能、高效，也更加节省时间。",
    enContent:
      "In my city, I usually walk or take a taxi because local public transport sometimes requires inconvenient transfers and is not always efficient. If the distance is short, I walk. If I am in a hurry or carrying many things, I take a taxi. Compared with public transport, I prefer private cars or taxis because they are more convenient and flexible. However, it is very easy for me to get to Beijing. It takes about 21 minutes by high-speed rail from my home to Beijing, and Beijing Daxing Airport is also nearby. So although I live in a small city, I do not feel completely separated from a big city. In Beijing, I prefer taking the subway because the traffic there is very congested, and driving is not always faster. In the future, I think transportation will become smarter, with more accurate route planning, smoother public transport connections, and perhaps more autonomous driving services.",
    tags: ["transportation", "taxi", "walking", "beijing", "subway"],
    relatedQuestions: [
      "How do you usually get around?",
      "Do you prefer public transport or private cars?",
      "How do you think transportation will change in the future?",
      "Is traffic a problem in big cities?"
    ],
    children: [
      {
        slug: "local-transport",
        zhTitle: "本地出行方式",
        enTitle: "Local transport choices",
        zhSummary: "短距离走路，赶时间或东西多时打车。",
        enSummary:
          "She walks for short distances and takes taxis when rushed or carrying things.",
        zhContent:
          "在本地，我最常用的方式是走路和打车。走路比较自由，也不用等车；打车则适合赶时间或者天气不好时。公共交通不是不能用，只是对我来说没有那么方便。",
        enContent:
          "Locally, I most often walk or take a taxi. Walking is flexible and does not require waiting. Taking a taxi is better when I am in a hurry or when the weather is bad. Public transport is possible, but for me it is not always convenient.",
        tags: ["transportation", "walking", "taxi", "local-life"],
        relatedQuestions: [
          "How do you usually get around?",
          "Do you walk a lot?",
          "Is public transport convenient where you live?"
        ]
      },
      {
        slug: "beijing-access",
        zhTitle: "到北京很方便",
        enTitle: "Easy access to Beijing",
        zhSummary: "高铁和机场让她的小城市生活与北京资源连接起来。",
        enSummary:
          "High-speed rail and the airport connect her small-city life with Beijing's resources.",
        zhContent:
          "我家到北京坐高铁大约 21 分钟，这点非常方便。北京大兴机场也离我很近，所以出行、看展或者以后工作面试都比较容易安排。这是廊坊很大的位置优势。",
        enContent:
          "It takes about 21 minutes from my home to Beijing by high-speed rail, which is very convenient. Beijing Daxing Airport is also close to me, so traveling, visiting exhibitions, or attending future job interviews can be easier to arrange. This is a big location advantage of Langfang.",
        tags: ["transportation", "beijing", "high-speed-rail", "airport"],
        relatedQuestions: [
          "Is it easy to travel from your hometown?",
          "Do you often travel to nearby cities?",
          "How has high-speed rail changed people's lives?"
        ]
      },
      {
        slug: "future-transport",
        zhTitle: "未来交通更智能",
        enTitle: "Smarter future transportation",
        zhSummary: "她认为未来交通会更智能、更高效，也更依赖数据和系统设计。",
        enSummary:
          "She thinks future transportation will be smarter, more efficient, and more system-based.",
        zhContent:
          "我觉得未来交通会更智能，不只是车本身更先进，也包括路线规划、换乘系统和城市管理更高效。作为设计背景的人，我会觉得交通其实也是一种服务系统设计。",
        enContent:
          "I think future transportation will be smarter, not only because vehicles will become more advanced, but also because route planning, transfer systems, and city management will become more efficient. From a design perspective, transportation is also a kind of service system design.",
        tags: ["transportation", "future", "technology", "service-design"],
        relatedQuestions: [
          "How will transportation change in the future?",
          "Will technology make travel easier?",
          "What transportation problems do cities need to solve?"
        ]
      }
    ]
  },
  {
    slug: "weekend",
    order: 15,
    zhTitle: "周末",
    enTitle: "Weekend",
    zhSummary: "她周末通常休息、学习、整理内容，也会见朋友或和家人团聚。",
    enSummary:
      "Her weekends usually include rest, study, organizing ideas, meeting friends, and family reunion.",
    zhContent:
      "我周末通常会宅在家休息，或者学习、整理这一周学到的知识。有时候我也会见朋友，或者邀请朋友来我家里，我会给他们做饭吃，因为我很喜欢做饭。\n\n我通常会把周末分成几个部分：一部分是安静休息的时间，一部分是用来安排和完成一些事情的时间。我认为这样的周末才算是完整的、有意义的，因为它既能让我放松，又能让我完成任务。\n\n我也很喜欢和家人一起度过周末。因为我的爸爸经常出差，很多时候只有周末才能回家和我团聚，所以周末对我来说也有家庭团聚的意义。\n\n我认为周末对我来说很重要。一方面，它可以让我从一周的学习压力中放松下来；另一方面，它也可以让我整理这一周做过的事情，让我对自己的生活和学习更有掌控感。\n\n我理想中的周末就是既可以完成任务，又有放松的时光。小时候的周末，我经常和爸妈去周边城市玩，但现在因为学习压力比较大，我不能每周都花很长时间出去玩了。\n\n如果周末天气很好，我会很想出去野餐；如果下雨，我就更喜欢待在家里睡觉或者休息。",
    enContent:
      "My weekends are usually quiet. I am not the kind of person who fills weekends with many activities. I often stay at home to rest, study, or organize what I have learned during the week. Since my classes and application tasks can be fragmented, the weekend is a time for me to reset my rhythm. Sometimes I meet friends or invite them to my home, and I cook simple meals for them. Weekends also mean family reunion to me because my father often travels for work and usually comes home on weekends. So weekends are not only for rest; they are also a time to bring life back together. My ideal weekend includes finishing some important tasks and also having real relaxation, such as watching a film, cooking, taking a walk, or sleeping in.",
    tags: ["weekend", "family", "rest", "study", "lifestyle"],
    relatedQuestions: [
      "What do you usually do on weekends?",
      "Do you prefer spending weekends with friends or family?",
      "What is your ideal weekend?",
      "Do you think weekends are important?"
    ],
    children: [
      {
        slug: "home-reset",
        zhTitle: "宅家整理",
        enTitle: "Staying home and organizing",
        zhSummary: "周末是她整理学习内容和恢复节奏的时间。",
        enSummary:
          "Weekends help her organize study materials and reset her rhythm.",
        zhContent:
          "我周末经常在家整理一周的内容，比如作品集进度、学习材料或者生活计划。这个过程不一定很激烈，但会让我觉得生活重新变得清楚。",
        enContent:
          "On weekends, I often stay at home and organize things from the week, such as portfolio progress, study materials, or life plans. This process is not necessarily intense, but it makes my life feel clearer again.",
        tags: ["weekend", "study", "organization", "home"],
        relatedQuestions: [
          "What do you usually do at home on weekends?",
          "Do you use weekends to study?",
          "How do you organize your week?"
        ]
      },
      {
        slug: "friends-at-home",
        zhTitle: "邀请朋友来家里",
        enTitle: "Inviting friends home",
        zhSummary: "她喜欢用做饭和聊天的方式和朋友轻松相处。",
        enSummary:
          "She likes spending relaxed time with friends by cooking and chatting at home.",
        zhContent:
          "有时我会邀请朋友来家里，而不是一定要出去玩。我会做一点简单的饭，大家一起聊天。这种方式很轻松，也比外面嘈杂的环境更亲近。",
        enContent:
          "Sometimes I invite friends to my home instead of going out. I cook something simple, and we chat together. This feels relaxed and more intimate than being in a noisy place outside.",
        tags: ["weekend", "friendship", "cooking", "home"],
        relatedQuestions: [
          "Do you meet friends on weekends?",
          "Do you prefer staying in or going out?",
          "What do people do with friends on weekends?"
        ]
      },
      {
        slug: "family-reunion",
        zhTitle: "家庭团聚",
        enTitle: "Family reunion",
        zhSummary: "父亲常出差，所以周末有家人重新聚在一起的意义。",
        enSummary:
          "Because her father travels for work, weekends often mean the family comes together again.",
        zhContent:
          "我爸爸经常出差，所以周末对我家来说有一点团聚的意义。大家可能只是一起吃饭、聊天，但这种普通的相处让我觉得家是稳定的。",
        enContent:
          "My father often travels for work, so weekends have a sense of reunion for my family. We may simply eat together and chat, but this ordinary time makes home feel stable to me.",
        tags: ["weekend", "family", "reunion", "home"],
        relatedQuestions: [
          "Do you spend weekends with your family?",
          "How important is family time?",
          "Do families in your country eat together on weekends?"
        ]
      }
    ]
  },
  {
    slug: "holiday",
    order: 16,
    zhTitle: "假期",
    enTitle: "Holiday & Vacation",
    zhSummary: "她喜欢长假和海边旅行，最近一次假期和家人去了海南三亚。",
    enSummary:
      "She likes long holidays and seaside trips, and her recent vacation was to Sanya with her family.",
    zhContent:
      "我当然很喜欢假期，因为我认为假期是真正属于我自己的时间。在假期里，我很喜欢旅行，所以我经常会和朋友或者家人一起出去旅游。同时，我也会安排一些学习时间，做一些我真正想做的学习项目。\n\n相比短假期，我更喜欢长假期，因为长假期会让我有更多时间去安排自己的生活。如果是假期太短，我通常刚刚休息没几天，就会开始觉得它马上要结束了，所以反而会感到有点焦虑。\n\n我很喜欢去海边度假，因为我很喜欢水，也很喜欢大海。最近一次假期，我和家人去了中国的海南三亚，那里有非常漂亮的大海，也让我感到很放松。\n\n我理想中的假期是既有学习，也有休息。对我来说，假期不仅是放松的时间，也可以是学习和充电的时间。我喜欢提前计划一部分假期安排，但也会留出一些没有安排的时间。这样我就可以根据当时的心情临时决定想做什么，让假期更自由，也更有真正属于自己的感觉。",
    enContent:
      "I like holidays because they feel like time that truly belongs to me. Usually, study, applications, and different tasks divide my time into small pieces, but holidays allow me to arrange life again. I enjoy traveling with friends or family, and I also leave some time for learning. Compared with short holidays, I prefer long holidays because short ones often end just when I begin to relax, while long holidays allow a slower rhythm. I really like the seaside, and my recent vacation was to Sanya, Hainan, with my family. The sea makes me feel relaxed, open, and slower than everyday life. My ideal holiday is not about doing nothing, and it is not about filling every hour with plans. I prefer planning part of it while leaving some flexible time. Ideally, I can rest and learn a little, so when I come back, I feel recharged.",
    tags: ["holiday", "vacation", "sanya", "family", "seaside"],
    relatedQuestions: [
      "Do you like holidays?",
      "Do you prefer long holidays or short holidays?",
      "What was your last vacation?",
      "Do you prefer travelling with family or friends?"
    ],
    children: [
      {
        slug: "sanya",
        zhTitle: "三亚海边假期",
        enTitle: "Seaside vacation in Sanya",
        zhSummary: "三亚的海边让她感到放松、开阔和被重新充电。",
        enSummary:
          "The seaside in Sanya made her feel relaxed, open, and recharged.",
        zhContent:
          "最近一次假期我和家人去了海南三亚。我很喜欢海边，因为它会让我暂时离开日常压力。看海的时候，人的注意力会从小问题上移开，心情也会变得更开阔。",
        enContent:
          "My recent vacation was to Sanya, Hainan, with my family. I love the seaside because it allows me to step away from daily pressure. When I look at the sea, my attention moves away from small problems, and my mood becomes more open.",
        tags: ["holiday", "sanya", "seaside", "family"],
        relatedQuestions: [
          "What was your last vacation?",
          "Do you like the seaside?",
          "Where do people in your country like to travel?"
        ]
      },
      {
        slug: "long-holidays",
        zhTitle: "更喜欢长假",
        enTitle: "Preferring long holidays",
        zhSummary: "长假让她有足够时间真正放松和安排生活。",
        enSummary:
          "Long holidays give her enough time to truly relax and arrange life.",
        zhContent:
          "我更喜欢长假，因为短假期经常还没进入状态就结束了。长假可以让我先休息，再安排旅行、学习或者见朋友，节奏更完整。",
        enContent:
          "I prefer long holidays because short holidays often end before I fully relax. During a long holiday, I can rest first and then arrange travel, study, or meeting friends. The rhythm feels more complete.",
        tags: ["holiday", "time", "relaxation", "planning"],
        relatedQuestions: [
          "Do you prefer long holidays or short holidays?",
          "How do people spend long holidays?",
          "Are holidays important for students?"
        ]
      },
      {
        slug: "balanced-holiday",
        zhTitle: "学习和休息的平衡",
        enTitle: "Balancing study and rest",
        zhSummary: "她理想的假期是有计划但不被计划填满。",
        enSummary:
          "Her ideal holiday is planned but not completely filled with plans.",
        zhContent:
          "我的理想假期不是每天都玩，也不是每天都学习。我希望它有一点计划，比如哪几天旅行、哪几天整理作品集，同时也有空白时间，可以根据当天状态决定做什么。",
        enContent:
          "My ideal holiday is not about having fun every day or studying every day. I hope it has some planning, such as which days to travel and which days to organize my portfolio, but also some blank time so I can decide what to do based on my mood.",
        tags: ["holiday", "study", "planning", "balance"],
        relatedQuestions: [
          "How do you plan your holidays?",
          "Do you study during holidays?",
          "Is it better to plan a trip or be spontaneous?"
        ]
      }
    ]
  },
  {
    slug: "birthday",
    order: 17,
    zhTitle: "生日",
    enTitle: "Birthday",
    zhSummary: "她喜欢生日，因为朋友之间会准备礼物和惊喜，18 岁生日的信让她印象深刻。",
    enSummary:
      "She likes birthdays because friends prepare gifts and surprises; a letter on her 18th birthday was especially memorable.",
    zhContent:
      "我很喜欢过生日，因为我和很多朋友都有互换生日礼物的习惯。当我生日的时候，我会收到很多来自朋友的生日礼物，这会让我觉得很开心，也会让我感受到自己被重视。\n\n我通常会和朋友一起聚会。我的朋友经常会给我准备生日惊喜，而在他们生日的时候，我也会帮他们准备惊喜。我觉得这是一种很有仪式感、也很温暖的互动方式。\n\n小时候的生日，我经常和家人一起度过；但是现在长大以后，我更多时候会和朋友一起过生日。对我来说，这种变化也代表着我的社交生活变得更加丰富了。\n\n我印象最深刻的生日礼物是我 18 岁的时候，我最好的朋友送给我的礼物。他给我准备了 18 件生日礼物，还有一封信，这让我非常感动。说实话，在所有礼物里，最让我感动的其实是那封信，因为它很有纪念意义，也包含了真诚的情感。\n\n相比特别实用的礼物，我更喜欢有纪念意义的礼物。我也会记得朋友和家人的生日，并且经常给他们准备惊喜。\n\n我认为生日很重要，因为它是给生活增添仪式感的一个时机。它让人有机会停下来，感受自己和身边人的关系。对我来说，理想中的生日就是既可以和朋友一起过，也可以和家人一起过。比如中午和朋友聚会，晚上和家人吃饭，或者反过来也可以。总之，我希望我的生日既热闹，又温暖。",
    enContent:
      "I like celebrating my birthday because it makes me feel valued. My friends and I have the habit of exchanging birthday gifts, so a birthday is not just a date; it is also a day when relationships are confirmed. I usually have a gathering with friends, and sometimes we prepare surprises for each other. The most memorable one was my 18th birthday. My best friend gave me 18 gifts and a letter. The gifts were already thoughtful, but what moved me the most was the letter because it recorded our relationship and made me feel a very sincere emotion. I prefer gifts with emotional value rather than things that are only practical or expensive. For me, the meaning of a birthday is not just excitement. It is about being remembered and cared about.",
    tags: ["birthday", "friendship", "gifts", "memory", "emotion"],
    relatedQuestions: [
      "Do you like celebrating birthdays?",
      "How do you usually celebrate your birthday?",
      "What was a memorable birthday gift?",
      "Do you prefer practical gifts or meaningful gifts?"
    ],
    children: [
      {
        slug: "feeling-valued",
        zhTitle: "被重视的感觉",
        enTitle: "Feeling valued",
        zhSummary: "生日让她感受到朋友记得她、在乎她。",
        enSummary:
          "Birthdays make her feel remembered and cared about by friends.",
        zhContent:
          "生日让我开心的不是一定要很隆重，而是别人记得这一天。朋友的一句祝福、一个小礼物或者一个惊喜，都会让我觉得自己是被在乎的。",
        enContent:
          "What makes me happy about birthdays is not that they have to be grand, but that people remember the day. A friend's message, a small gift, or a surprise can make me feel cared about.",
        tags: ["birthday", "emotion", "friendship"],
        relatedQuestions: [
          "Do you like celebrating birthdays?",
          "Why are birthdays important?",
          "How do people show care on birthdays?"
        ]
      },
      {
        slug: "eighteenth-birthday",
        zhTitle: "18 岁礼物和信",
        enTitle: "18th birthday gifts and letter",
        zhSummary: "18 件礼物和一封信成为她最难忘的生日记忆。",
        enSummary:
          "Eighteen gifts and a letter became her most unforgettable birthday memory.",
        zhContent:
          "18 岁生日时，我最好的朋友送了我 18 件礼物和一封信。礼物数量很有仪式感，但那封信更珍贵。它让我感觉我们的友情被认真记录了下来。",
        enContent:
          "On my 18th birthday, my best friend gave me 18 gifts and a letter. The number of gifts felt ceremonial, but the letter was more precious. It made me feel that our friendship had been carefully recorded.",
        tags: ["birthday", "friendship", "letter", "memory"],
        relatedQuestions: [
          "What was a memorable birthday gift?",
          "Do you like receiving letters?",
          "Are handmade or personal gifts special?"
        ]
      },
      {
        slug: "meaningful-gifts",
        zhTitle: "有纪念意义的礼物",
        enTitle: "Meaningful gifts",
        zhSummary: "她更喜欢有情感价值、能被记住的礼物。",
        enSummary:
          "She prefers gifts with emotional value that can be remembered.",
        zhContent:
          "我不觉得礼物一定要很贵。真正让我记住的礼物，通常是和某段关系或某个时刻有关的东西。它可能很小，但只要有心意，就会变得特别。",
        enContent:
          "I do not think a gift has to be expensive. The gifts I remember are usually connected with a relationship or a particular moment. They may be small, but if they are thoughtful, they become special.",
        tags: ["birthday", "gifts", "emotion", "value"],
        relatedQuestions: [
          "Do you prefer expensive gifts or meaningful gifts?",
          "What kinds of gifts do young people like?",
          "Why do people give gifts?"
        ]
      }
    ]
  },
  {
    slug: "social-media",
    order: 18,
    zhTitle: "社交媒体",
    enTitle: "Social Media",
    zhSummary: "她常用小红书找灵感和放松，但更喜欢只看不发，也重视网络隐私。",
    enSummary:
      "She often uses Xiaohongshu for inspiration and relaxation, but prefers browsing to posting and cares about privacy.",
    zhContent:
      "我很喜欢使用社交媒体。我经常用它来放松，也会用它来寻找灵感。对我来说，社交媒体不仅是一种娱乐方式，也是一种获取信息和激发想法的工具。\n\n我最常使用的社交媒体是小红书，因为上面的女性用户很多，我经常能找到一些自己感兴趣或者真正有用的内容。比如设计灵感、英语学习方法、穿搭、美妆、生活经验，或者一些当下的热点话题。\n\n不过，我不太喜欢在社交媒体上分享自己的生活，更喜欢只看不发。可能是因为我爸妈从小给我灌输的观念是，在网络上过度分享自己的生活可能会让自己变得不安全。所以我通常会比较谨慎，不太愿意公开太多个人信息。\n\n社交媒体对我很有帮助。它可以让我获得大量信息，也可以帮助我找到设计灵感、学习英语的方法，或者了解最近的热点。但是它也会带来一些负面影响。比如我有时候会在上面浪费很多时间，而且网络上很多人会展示奢侈品或者精致生活，这可能会让我变得更加消费主义。\n\n我认为现在的人确实有一些依赖社交媒体，但我觉得这也可以理解，因为社交媒体总体上还是利大于弊的。而且在现代生活中，这种依赖几乎是一定会发生的。\n\n如果有一天不能使用社交媒体，我会觉得非常不方便。说实话，我从来没有认真想象过有一天完全不能用社交媒体，希望这一天不要真的到来。",
    enContent:
      "I use social media quite often, mainly to relax and find inspiration. The platform I use most is Xiaohongshu because it has a lot of content about design, English learning, fashion, beauty, life experience, and trending topics. It can be helpful because I can see other people's portfolio experiences, learning methods, or life advice. However, I do not really like sharing my own life publicly. I prefer browsing rather than posting. One reason is that I care about online privacy, and another reason is that public sharing gives me a little pressure. The advantage of social media is that it provides rich information and quick inspiration. But the disadvantages are also obvious: it wastes time and may make me more consumerist. When I see too many beautiful products and lifestyles, it is easy to feel that I need to buy something too. So now I try to remind myself that social media can be a reference, but I should not be completely led by it.",
    tags: ["social-media", "xiaohongshu", "privacy", "inspiration", "consumerism"],
    relatedQuestions: [
      "Do you use social media often?",
      "What social media platform do you use most?",
      "Do you like sharing your life online?",
      "What are the advantages and disadvantages of social media?"
    ],
    children: [
      {
        slug: "xiaohongshu",
        zhTitle: "小红书找灵感",
        enTitle: "Finding inspiration on Xiaohongshu",
        zhSummary: "她用小红书看设计、英语、穿搭和生活经验。",
        enSummary:
          "She uses Xiaohongshu for design, English learning, fashion, and life experience.",
        zhContent:
          "小红书对我来说像一个灵感库。我会看设计案例、英语学习经验、穿搭和生活建议。有时候它能给我很多具体参考，比如作品集排版或者申请经验。",
        enContent:
          "Xiaohongshu is like an inspiration library for me. I look at design cases, English learning experiences, fashion, and life advice. Sometimes it gives me very concrete references, such as portfolio layout or application experiences.",
        tags: ["social-media", "xiaohongshu", "design", "inspiration"],
        relatedQuestions: [
          "What social media platform do you use most?",
          "Can social media help people learn?",
          "Where do you find inspiration?"
        ]
      },
      {
        slug: "privacy",
        zhTitle: "只看不发和隐私",
        enTitle: "Browsing and privacy",
        zhSummary: "她不太喜欢公开分享，因为重视隐私，也不想承受表达压力。",
        enSummary:
          "She does not like public posting because she values privacy and dislikes the pressure of sharing.",
        zhContent:
          "我更喜欢浏览，而不是发布自己的生活。因为网络上的东西一旦公开，就很难完全控制。我也不太想为了别人怎么看而调整自己的生活展示。",
        enContent:
          "I prefer browsing rather than posting my own life. Once something is public online, it is difficult to fully control. I also do not want to adjust how I present my life just because of how others may see it.",
        tags: ["social-media", "privacy", "online-life"],
        relatedQuestions: [
          "Do you like sharing your life online?",
          "Is online privacy important?",
          "Why do some people prefer not to post?"
        ]
      },
      {
        slug: "consumerism",
        zhTitle: "信息和消费主义",
        enTitle: "Information and consumerism",
        zhSummary: "社交媒体有信息价值，但也容易刺激消费欲望。",
        enSummary:
          "Social media is informative but can also stimulate consumer desire.",
        zhContent:
          "社交媒体的问题是它会不断展示更好看的东西、更理想的生活方式。看多了以后，人很容易觉得自己缺少什么。我觉得这就是它让人变消费主义的一面。",
        enContent:
          "The problem with social media is that it constantly shows more beautiful things and more ideal lifestyles. After seeing too much, people may easily feel that they lack something. I think this is the consumerist side of social media.",
        tags: ["social-media", "consumerism", "lifestyle", "self-control"],
        relatedQuestions: [
          "Does social media influence shopping?",
          "What are the disadvantages of social media?",
          "How can people use social media wisely?"
        ]
      }
    ]
  },
  {
    slug: "animals-pets",
    order: 19,
    zhTitle: "动物与宠物",
    enTitle: "Animals & Pets",
    zhSummary: "她喜欢猫狗，家里有猫；宠物治愈但也需要责任、金钱和时间。",
    enSummary:
      "She likes cats and dogs and has a family cat; pets are healing but require responsibility, money, and time.",
    zhContent:
      "我非常非常喜欢动物，最喜欢的当然是小猫和小狗。我家里养了一只猫，但其实它主要是我妈妈在养，因为平时是我妈妈照顾它，而我很多时候要去上学。\n\n我觉得小狗很忠诚，也更活泼一些；小猫则更安静一些。其实我两种都很喜欢。不过小狗可能需要每天出去遛，也需要主人提供更多的陪伴和情绪价值。小猫相对更安静、更独立，但有时候它也不会给人很多情绪上的回应。\n\n我认为养宠物有很多好处。比如当我伤心的时候，别人可能都不能真正安慰到我，但是我家的小猫只要出现在我身边，我就会觉得很治愈。它不需要做什么，只是陪在那里，就能让我感觉好很多。\n\n当然，养宠物也有很多麻烦的地方。比如我家的猫会掉毛，它吃的东西也比较贵。如果吃得不好，它可能还会生病；而一旦它生病，就会打乱我的一些计划。不过我认为这些都是养宠物应该承担的责任。\n\n我小时候就很喜欢动物，和现在一样。我也很喜欢去动物园，因为除了猫和狗，我其实也很喜欢老虎和狮子。它们看起来很大、很凶，但有时候又会有一些呆萌的样子，这种反差让我觉得很有趣。\n\n未来我可能不太会轻易养宠物。虽然我真的很想养，但我认为养宠物需要一定的经济能力和责任感。我不确定自己是否有能力完全对一个小生命负责，所以我会比较谨慎地考虑这件事。",
    enContent:
      "I really love animals, especially cats and dogs. My family has a cat, although my mother mainly takes care of it. For me, cats and dogs have very different personalities. Dogs are usually more loyal and lively, and they express affection directly. Cats are quieter and more independent, and sometimes they seem to have their own world. Pets can be very healing, especially when you are under pressure. Seeing them sleep or come close to you can bring a soft kind of comfort. But I also think keeping a pet is not easy. Pets shed hair, cost money, and may get sick, so they require long-term responsibility. In the future, I would not raise a pet casually unless I have stable financial ability, enough time, and mental preparation. Loving animals is one thing; taking good care of them is another.",
    tags: ["animals", "pets", "cat", "responsibility", "family"],
    relatedQuestions: [
      "Do you like animals?",
      "Do you have a pet?",
      "What are the advantages and disadvantages of keeping pets?",
      "Do you prefer cats or dogs?"
    ],
    children: [
      {
        slug: "cats-and-dogs",
        zhTitle: "猫和狗的性格",
        enTitle: "Cats and dogs",
        zhSummary: "狗更直接活泼，猫更安静独立。",
        enSummary:
          "Dogs are more direct and lively, while cats are quieter and more independent.",
        zhContent:
          "我喜欢猫和狗，但喜欢它们的原因不一样。狗很热情，会让人感觉被需要；猫比较独立，它不会一直黏着你，但偶尔靠近时反而很珍贵。",
        enContent:
          "I like both cats and dogs, but for different reasons. Dogs are warm and make people feel needed. Cats are more independent. They do not stay close all the time, but when they come to you, it feels more precious.",
        tags: ["animals", "cats", "dogs", "personality"],
        relatedQuestions: [
          "Do you prefer cats or dogs?",
          "What animals do people like in your country?",
          "Why do people like pets?"
        ]
      },
      {
        slug: "family-cat",
        zhTitle: "家里的猫",
        enTitle: "My family cat",
        zhSummary: "家里有猫，主要由妈妈照顾，她更多是陪伴和观察。",
        enSummary:
          "Her family has a cat mainly cared for by her mother, while she mostly keeps it company.",
        zhContent:
          "我家里有一只猫，但主要是我妈妈照顾。我更多是陪它玩、观察它或者偶尔摸摸它。猫的存在让家里多了一点生命感，也让日常生活更柔软。",
        enContent:
          "My family has a cat, but my mother mainly takes care of it. I mostly play with it, observe it, or pet it sometimes. Having a cat at home adds a sense of life and makes daily life feel softer.",
        tags: ["animals", "cat", "family", "home"],
        relatedQuestions: [
          "Do you have a pet?",
          "Who takes care of pets in your family?",
          "What is it like to have a pet at home?"
        ]
      },
      {
        slug: "responsibility",
        zhTitle: "治愈和责任",
        enTitle: "Healing and responsibility",
        zhSummary: "宠物能带来安慰，但也意味着长期责任。",
        enSummary:
          "Pets can bring comfort, but they also mean long-term responsibility.",
        zhContent:
          "宠物很治愈，但我不会把它们只当作可爱的东西。它们需要吃饭、看病、陪伴和清理。未来如果我养宠物，我希望是在自己真的有能力负责的时候。",
        enContent:
          "Pets are healing, but I would not see them only as cute things. They need food, medical care, company, and cleaning. If I keep a pet in the future, I hope it will be when I am truly able to take responsibility.",
        tags: ["animals", "pets", "responsibility", "future"],
        relatedQuestions: [
          "What are the disadvantages of keeping pets?",
          "Should people think carefully before getting a pet?",
          "Can pets improve people's mental health?"
        ]
      }
    ]
  },
  {
    slug: "bag",
    order: 20,
    zhTitle: "包",
    enTitle: "Bag",
    zhSummary: "她平时喜欢轻便出门，常用帆布包，更看重实用性和穿搭完整度。",
    enSummary:
      "She likes going out light, often uses canvas bags, and values practicality and outfit completeness.",
    zhContent:
      "我平常不太喜欢背包，出门通常不会带包，因为我觉得这样会更轻便一些。如果一定要带包的话，我常常会选择帆布包，因为它更轻松、更舒适，而且价格也比较便宜，就算弄脏或者用旧了，也不会太心疼。\n\n我的包里通常会放一些可能用到的东西，比如纸巾或者补妆产品。有时候我也会带上我的 Kindle 和水杯。我更看重包的实用性，当然我也有一些专门用来搭配衣服的包，但说实话，它们的利用率比较低。\n\n我有一个特别喜欢的帆布包，因为它很轻便，设计也很简单，能够搭配很多衣服，使用起来也很方便。我买包的频率还算正常，而且对于包来说，我通常不会特别冲动消费，因为我知道自己其实没有那么喜欢背包。\n\n不过，有些包我也会觉得实在太漂亮了。即使我知道自己不常背，在经过深思熟虑之后，我还是会购买，因为只要看着它就会很开心。我也不太确定这算不算冲动消费。\n\n我认为包对穿搭还是很重要的，因为它会影响整体造型的完整性。其实不背包也还好，但如果背了一个和穿搭风格很不一样的包，就会显得很突兀。\n\n我小时候会背书包，但那时候的书包和现在的包很不一样。小时候的书包通常有很宽的肩带，因为要背很多很重的书；而现在的包往往会有更细的肩带，因为这样看起来会更好看。",
    enContent:
      "I do not usually like carrying a heavy bag because I prefer going out light. If I need to carry one, I often choose a canvas bag because it is casual, affordable, and comfortable, and it does not look too formal. I usually put tissues, makeup items, my Kindle, and a water bottle in my bag, and sometimes other small things. For me, a bag should first be practical. It needs to hold what I need without becoming a burden. Of course, I can still be attracted by beautiful bags because a bag can affect the completeness of an outfit. Sometimes the clothes are simple, but if the bag matches well, the whole look becomes more polished. Still, if I had to choose between beauty and practicality, most of the time I would choose practicality.",
    tags: ["bag", "fashion", "practicality", "lifestyle", "kindle"],
    relatedQuestions: [
      "Do you usually carry a bag?",
      "What do you put in your bag?",
      "Do you think bags are important for fashion?",
      "Do you prefer beautiful or practical bags?"
    ],
    children: [
      {
        slug: "light",
        zhTitle: "轻便出门",
        enTitle: "Going out light",
        zhSummary: "她不喜欢负担太重，出门希望轻松自由。",
        enSummary:
          "She dislikes heavy burdens and wants to feel light and free when going out.",
        zhContent:
          "我出门时不喜欢带太多东西，因为包太重会让我觉得很麻烦。我更喜欢只带真正需要的东西，这样走路、逛街或者见朋友都更轻松。",
        enContent:
          "I do not like carrying too many things when I go out because a heavy bag feels troublesome. I prefer taking only what I really need, so walking, shopping, or meeting friends becomes easier.",
        tags: ["bag", "lifestyle", "minimal", "comfort"],
        relatedQuestions: [
          "Do you usually carry a bag?",
          "Do you like carrying many things?",
          "What do people usually carry when they go out?"
        ]
      },
      {
        slug: "canvas-bag",
        zhTitle: "帆布包",
        enTitle: "Canvas bag",
        zhSummary: "帆布包轻松、便宜、舒服，适合日常生活。",
        enSummary:
          "Canvas bags are casual, affordable, comfortable, and suitable for daily life.",
        zhContent:
          "如果要带包，我经常会选帆布包。它没有太强的正式感，很适合学生日常使用。它也不贵，所以用起来没有心理负担。",
        enContent:
          "If I need a bag, I often choose a canvas bag. It does not look too formal, so it is suitable for a student's daily life. It is also not expensive, so I do not feel stressed when using it.",
        tags: ["bag", "canvas-bag", "student-life", "practicality"],
        relatedQuestions: [
          "What kind of bag do you like?",
          "Are canvas bags popular?",
          "Do students need bags?"
        ]
      },
      {
        slug: "outfit",
        zhTitle: "实用性和穿搭",
        enTitle: "Practicality and outfit",
        zhSummary: "她更重视实用，但也承认包能提升穿搭质感。",
        enSummary:
          "She values practicality more, but admits that bags can improve an outfit.",
        zhContent:
          "我更看重包是否实用，但我也会注意它和衣服搭不搭。一个合适的包可以让整体穿搭更完整，也能让人看起来更有细节感。",
        enContent:
          "I care more about whether a bag is practical, but I also notice whether it matches my clothes. A suitable bag can make an outfit feel more complete and detailed.",
        tags: ["bag", "fashion", "practicality", "outfit"],
        relatedQuestions: [
          "Do you think bags are important for fashion?",
          "Do you care about matching clothes and bags?",
          "What makes an outfit look complete?"
        ]
      }
    ]
  },
  {
    slug: "photo-picture",
    order: 21,
    zhTitle: "照片与图片",
    enTitle: "Photo & Picture",
    zhSummary: "她喜欢拍照，尤其旅行时拍建筑；手机更方便，照片最重要是保存记忆。",
    enSummary:
      "She likes taking photos, especially architecture during travel; phones are more convenient, and photos preserve memories.",
    zhContent:
      "我很喜欢拍照，而且我经常拍照。我的相册很杂，因为各种各样的生活瞬间我都喜欢记录下来。尤其是在旅游的时候，我经常喜欢拍建筑，因为我真的很热爱建筑，也很喜欢那些漂亮的建筑。\n\n相比相机，我更喜欢用手机拍照。因为我出门不喜欢带太多东西，而且现在手机的像素也很高，对我来说用手机拍照已经足够了。\n\n我会修图，尤其是在修人像照片的时候。特别是如果照片里有我自己，我会把自己修得更漂亮一些，然后再发到社交媒体上。我觉得这也是一种很自然的表达方式。\n\n有一张照片对我来说很有意义。那是一次旅游的时候，导游帮我们拍的一张全家福。我的家人都在那张照片里，而且当时我们正在旅行，每个人都很开心，所以这张照片对我来说非常珍贵。\n\n我觉得照片有很多意义。对我来说，最重要的是保存回忆。它可以把某一个瞬间、某一种心情或者某段关系保存下来。当然，如果我把照片分享到社交媒体上，它也可以表达我的审美，同时分享我的生活。",
    enContent:
      "I like taking photos, so my photo album is quite mixed. It includes landscapes, architecture, friends, family, and small details from daily life. When traveling, I especially like taking photos of architecture because I studied architecture and genuinely love beautiful buildings and spaces. Compared with a camera, I prefer using my phone because it is convenient and always ready. I also edit photos, especially portraits or pictures with me in them. I care more about lighting, skin tone, and composition in those cases. For me, a precious photo does not have to be the most professional one. It has to be connected with memory. For example, during one trip, a tour guide took a family photo for us, and that picture is very meaningful to me. The most important role of photos is preserving memories. People may forget details, but photos can bring a moment back.",
    tags: ["photos", "architecture", "memory", "travel", "phone"],
    relatedQuestions: [
      "Do you like taking photos?",
      "Do you prefer using a camera or a phone?",
      "What kind of photos are meaningful to you?",
      "Do you like editing photos?"
    ],
    children: [
      {
        slug: "architecture-photos",
        zhTitle: "旅行拍建筑",
        enTitle: "Taking architecture photos",
        zhSummary: "建筑背景让她旅行时特别关注建筑和空间。",
        enSummary:
          "Her architecture background makes her pay attention to buildings and spaces while traveling.",
        zhContent:
          "旅行时我很喜欢拍建筑。别人可能更关注打卡照，但我会注意建筑的比例、材料、光线和空间氛围。这和我的建筑学背景有很大关系。",
        enContent:
          "When traveling, I really like taking photos of architecture. Other people may focus more on tourist photos, but I pay attention to proportions, materials, light, and spatial atmosphere. This is strongly related to my architecture background.",
        tags: ["photos", "architecture", "travel", "design"],
        relatedQuestions: [
          "What do you like to photograph?",
          "Do you take photos when traveling?",
          "Why do people photograph buildings?"
        ]
      },
      {
        slug: "phone-camera",
        zhTitle: "手机比相机方便",
        enTitle: "Phone over camera",
        zhSummary: "手机方便快速，更适合日常记录。",
        enSummary:
          "Phones are quick and convenient, making them better for daily recording.",
        zhContent:
          "我更喜欢用手机拍照，因为手机一直在身边。相机可能画质更好，但对日常记录来说，方便比专业更重要。很多瞬间如果不立刻拍下来，就会错过。",
        enContent:
          "I prefer using my phone to take photos because it is always with me. A camera may have better image quality, but for daily recording, convenience is more important than professionalism. Many moments will be missed if I do not capture them immediately.",
        tags: ["photos", "phone", "daily-life", "convenience"],
        relatedQuestions: [
          "Do you prefer using a camera or a phone?",
          "Has smartphone photography changed people's lives?",
          "Do people take too many photos nowadays?"
        ]
      },
      {
        slug: "family-photo",
        zhTitle: "珍贵的全家福",
        enTitle: "A meaningful family photo",
        zhSummary: "导游拍的全家福珍贵，因为它保存了一次家庭旅行的记忆。",
        enSummary:
          "A family photo taken by a guide is precious because it preserves a family trip memory.",
        zhContent:
          "一张对我很珍贵的照片，是旅行时导游帮我们拍的全家福。它不一定是最完美的照片，但它记录了家人在一起的一个时刻。以后再看，会很容易想起那次旅行。",
        enContent:
          "One precious photo for me is a family picture taken by a tour guide during a trip. It may not be the most perfect photo, but it records a moment when my family was together. When I look at it later, it easily brings back that trip.",
        tags: ["photos", "family", "memory", "travel"],
        relatedQuestions: [
          "What kind of photos are meaningful to you?",
          "Do you keep family photos?",
          "Why are photos important?"
        ]
      }
    ]
  },
  {
    slug: "colours",
    order: 22,
    zhTitle: "颜色",
    enTitle: "Colours",
    zhSummary: "她最喜欢红色，日常常穿黑色，也关注颜色和空间心理、产品质感。",
    enSummary:
      "Her favorite color is red, she often wears black, and she notices color psychology and product quality.",
    zhContent:
      "我最喜欢的颜色是红色，因为我觉得它是一种充满热情的颜色。它看起来很有能量，也会让人觉得很积极。\n\n不过我平时穿衣服更喜欢穿黑色，因为黑色的衣服往往会比较显瘦。最近我有一点长胖了，所以黑色会让我更有安全感。\n\n相比低调的颜色，我其实更喜欢明亮的颜色，因为它们看起来更热情，也更阳光。小时候我曾经很喜欢蓝色，因为我觉得蓝色充满幻想感，但现在我最喜欢的是红色。\n\n我认为颜色确实会影响人的心情。因为我学过建筑学，所以我曾经看过一些关于颜色和空间心理的内容。比如，如果一个人长时间住在颜色不合适的空间里，可能会影响情绪。所以我觉得颜色不只是装饰，它也和人的感受有关。\n\n我买东西的时候很在意颜色，因为颜色往往会影响一个产品的整体质感。比如衣服、包、手机壳或者家具，如果颜色不好看，整个物品就会显得没那么高级。\n\n如果是我的房间或者理想中的家，我可能会选择白色的墙和褐色的家具。因为我觉得这样的搭配比较古典，也很耐看。\n\n在中国文化里，金色有很多特别的含义。它常常象征着皇帝，也象征着至高无上的权力，所以它是一种很有传统文化意味的颜色。",
    enContent:
      "My favorite color is red because it feels passionate and energetic. When I was a child, I liked blue more, probably because blue felt calm. But now I prefer red because it is more direct and lively. However, in daily clothing, I most often wear black because it makes me look slimmer and feel safer. It is not easy to get wrong and works for many occasions. Because I studied architecture, I pay attention to color and spatial psychology. Different colors affect the mood of a space. For example, white makes a space brighter, while darker colors can make it feel more stable. When buying products, I also care about color because it affects the texture and first impression of a product. For my ideal home, I would probably choose white walls and brown furniture, which would feel clean and warm.",
    tags: ["colours", "red", "black", "design", "spatial-psychology"],
    relatedQuestions: [
      "What is your favourite colour?",
      "Do colours affect your mood?",
      "Do you care about colour when buying things?",
      "What colours would you choose for your home?"
    ],
    children: [
      {
        slug: "red",
        zhTitle: "喜欢红色",
        enTitle: "Liking red",
        zhSummary: "红色让她联想到热情、能量和生命力。",
        enSummary:
          "Red reminds her of passion, energy, and liveliness.",
        zhContent:
          "我现在最喜欢红色，因为它很有能量。红色不是很低调的颜色，但它能让人感觉更有力量和行动力。我觉得它也挺符合我现在想变得更坚定的状态。",
        enContent:
          "My favorite color now is red because it has strong energy. Red is not a very low-key color, but it makes people feel more powerful and active. I think it also matches my current desire to become more determined.",
        tags: ["colours", "red", "energy", "mood"],
        relatedQuestions: [
          "What is your favourite colour?",
          "Has your favourite colour changed?",
          "What does red mean in your culture?"
        ]
      },
      {
        slug: "black-clothes",
        zhTitle: "日常穿黑色",
        enTitle: "Wearing black in daily life",
        zhSummary: "黑色显瘦、安全、不容易出错，适合日常穿搭。",
        enSummary:
          "Black feels slimming, safe, and easy to wear in daily outfits.",
        zhContent:
          "虽然我喜欢红色，但平时穿衣更常穿黑色。黑色让我觉得安全，也比较显瘦。它不会太张扬，而且很容易搭配，所以我在不知道穿什么的时候经常选黑色。",
        enContent:
          "Although I like red, I wear black more often in daily life. Black makes me feel safe and also looks slimming. It is not too eye-catching and is easy to match, so when I do not know what to wear, I often choose black.",
        tags: ["colours", "black", "fashion", "security"],
        relatedQuestions: [
          "What colour clothes do you usually wear?",
          "Do you think clothing colours matter?",
          "Why do many people like wearing black?"
        ]
      },
      {
        slug: "colour-design",
        zhTitle: "颜色和设计",
        enTitle: "Colour and design",
        zhSummary: "建筑学习让她更关注颜色如何影响空间和产品质感。",
        enSummary:
          "Studying architecture made her notice how color affects space and product quality.",
        zhContent:
          "因为学过建筑，我会比较注意颜色对空间情绪的影响。比如白色会让空间显得干净明亮，褐色家具会让家更温暖。颜色也会影响产品看起来高级还是廉价。",
        enContent:
          "Because I studied architecture, I pay attention to how color affects the mood of a space. For example, white makes a room look clean and bright, while brown furniture makes a home feel warmer. Color can also influence whether a product looks high-quality or cheap.",
        tags: ["colours", "design", "architecture", "product-quality"],
        relatedQuestions: [
          "Do colours affect your mood?",
          "Do you care about colour when buying things?",
          "How do designers use colour?"
        ]
      }
    ]
  },
  {
    slug: "time-management",
    order: 23,
    zhTitle: "时间管理",
    enTitle: "Time Management",
    zhSummary: "她不擅长细致规划，更偏灵活安排；会拖延，但通常能在截止日前完成。",
    enSummary:
      "She is not good at detailed planning and prefers flexibility; she procrastinates but usually finishes before deadlines.",
    zhContent:
      "说实话，我不太擅长时间管理。你知道人格测试吗？我是一个比较典型的 P 人，所以我通常不会提前把每天的安排规划得特别具体。\n\n不过，我会在脑子里大概想一下这一周都有什么任务。有时候我也会把它们写在手机备忘录里，但这种情况比较少。大多数时候，我还是更依靠脑子里的大概计划。\n\n如果有很多任务要做，我会优先安排学习上必须完成的事情。因为这些任务通常更加紧急，也更不能拖延。其他不那么重要的事情，我可能会放到后面再处理。\n\n我很容易拖延。有时候是因为我比较懒，更想放松；有时候是因为我有更喜欢、更感兴趣的事情想做。不过我通常都能在截止时间前的最后一刻把任务完成。\n\n现在时间管理对我来说是一个比较大的压力，因为我正在准备申请硕士。但申请这件事不像普通作业一样有非常明确的时间节点，这对我来说有点困难。因为我是一个很依靠 deadline 的人，如果没有明确的截止时间，我就需要自己规划时间，所以现在我做事情有一点混乱，也还在寻找其中的平衡。\n\n相比固定的计划，我更喜欢灵活的安排。因为我经常在不同的时间对不同的事情感兴趣，而只有当我真的有兴趣的时候，我才会更有动力去做这件事。如果强行给自己安排得太死，我可能会觉得很疲惫。\n\n如果计划被打乱了，我通常也不会特别生气。我会重新安排，然后尽量抓紧时间，在最终的时间节点之前把事情完成。",
    enContent:
      "I am not very good at time management. I am more of a typical P type, so I do not plan every day in great detail. Usually, I keep a rough weekly plan in my mind and know what the most important things are. If I have many tasks, I write them in my phone notes. When there are many things to do, I prioritize important study-related or application-related tasks. My problem is that I tend to procrastinate, especially when a task does not have a clear deadline. For example, applying for a master's degree and organizing a portfolio do not feel like normal assignments with a very clear deadline, so they actually require more self-discipline. But if the deadline is clear, I can usually finish before it. Compared with a strict timetable, I prefer flexible schedules because I want to adjust tasks based on my condition that day. In the future, what I want to improve is not filling every minute, but starting important tasks earlier.",
    tags: ["time-management", "planning", "procrastination", "self-discipline", "flexibility"],
    relatedQuestions: [
      "Are you good at time management?",
      "How do you plan your day?",
      "Do you often procrastinate?",
      "How can people manage their time better?"
    ],
    children: [
      {
        slug: "flexible-schedule",
        zhTitle: "灵活安排",
        enTitle: "Flexible schedules",
        zhSummary: "她更喜欢大方向明确、每天留有调整空间的安排。",
        enSummary:
          "She prefers having a clear general direction while leaving room for daily adjustment.",
        zhContent:
          "我不太适合特别死板的时间表。对我来说，更有效的是知道一周内要完成什么，然后每天根据状态安排。这样比较灵活，也不会因为计划太细而产生压力。",
        enContent:
          "A very rigid timetable does not suit me well. For me, it is more effective to know what I need to finish within the week and then arrange each day based on my condition. This is more flexible and does not create too much pressure from over-planning.",
        tags: ["time-management", "planning", "flexibility"],
        relatedQuestions: [
          "How do you plan your day?",
          "Do you prefer fixed or flexible schedules?",
          "Is it important to make plans?"
        ]
      },
      {
        slug: "procrastination",
        zhTitle: "拖延和截止日期",
        enTitle: "Procrastination and deadlines",
        zhSummary: "没有明确 deadline 时更容易拖延，有截止日期时能完成。",
        enSummary:
          "She procrastinates more without clear deadlines, but can finish when deadlines are fixed.",
        zhContent:
          "我容易拖延，尤其是任务很大、又没有明确截止时间的时候。但如果 deadline 很具体，我反而能进入冲刺状态。所以我现在需要学会给自己设置更清楚的小 deadline。",
        enContent:
          "I tend to procrastinate, especially when a task is large and does not have a clear deadline. But if the deadline is specific, I can enter a focused state. So now I need to learn to set clearer small deadlines for myself.",
        tags: ["time-management", "procrastination", "deadline", "self-discipline"],
        relatedQuestions: [
          "Do you often procrastinate?",
          "Why do people procrastinate?",
          "How can students avoid procrastination?"
        ]
      },
      {
        slug: "application-pressure",
        zhTitle: "申请带来的时间压力",
        enTitle: "Time pressure from applications",
        zhSummary: "申请硕士和作品集任务长期而模糊，更考验自律。",
        enSummary:
          "Master's applications and portfolio work are long-term and unclear, so they test self-discipline.",
        zhContent:
          "申请硕士让我觉得时间管理更难，因为它不是一个简单作业，而是一系列长期任务。作品集、文书、语言考试都需要推进，但每一项又不一定每天都有明确要求。",
        enContent:
          "Applying for a master's degree makes time management harder because it is not a simple assignment. It includes long-term tasks such as portfolio work, application essays, and language exams. Each part needs progress, but not every part has a clear daily requirement.",
        tags: ["time-management", "application", "portfolio", "study"],
        relatedQuestions: [
          "How do students manage long-term tasks?",
          "Is applying for university stressful?",
          "What helps people stay disciplined?"
        ]
      }
    ]
  }
];

function mainNode(seed: MainSeed): MaterialNode {
  return {
    id: seed.slug,
    parentId: "feng-yurao",
    order: seed.order,
    zhTitle: seed.zhTitle,
    enTitle: seed.enTitle,
    zhSummary: seed.zhSummary,
    enSummary: seed.enSummary,
    zhContent: seed.zhContent,
    enContent: seed.enContent,
    tags: seed.tags,
    relatedQuestions: seed.relatedQuestions,
    createdAt: now,
    updatedAt: now,
    children: seed.children.map((child, index) => childNode(seed, child, index))
  };
}

function childNode(parent: MainSeed, child: ChildSeed, index: number): MaterialNode {
  return {
    id: `${parent.slug}-${child.slug}`,
    parentId: parent.slug,
    order: index + 1,
    zhTitle: child.zhTitle,
    enTitle: child.enTitle,
    zhSummary: child.zhSummary,
    enSummary: child.enSummary,
    zhContent: child.zhContent,
    enContent: child.enContent,
    tags: child.tags,
    relatedQuestions: child.relatedQuestions,
    createdAt: now,
    updatedAt: now
  };
}

export const seedMaterials: MaterialNode[] = [
  {
    id: "feng-yurao",
    parentId: null,
    order: 0,
    zhTitle: "冯雨娆",
    enTitle: "Feng Yurao",
    zhSummary: "以真实生活素材为中心的 IELTS Speaking Band 7 个人素材树。",
    enSummary:
      "A personal material tree for IELTS Speaking Band 7, centered on real life experiences.",
    zhContent:
      "这是冯雨娆的个人口语素材根节点。主树只整理个人生活素材；雅思题目只作为每个节点的附属信息出现。素材重点是把真实生活、设计背景、学习计划、家庭和日常习惯整理成可以反复练习的表达。",
    enContent:
      "This is Feng Yurao's personal speaking material root. The main tree only contains personal life materials; IELTS questions appear only as supporting information inside each node. The focus is to organize real life, design background, study plans, family, and daily habits into reusable speaking materials.",
    tags: ["ielts-speaking", "band-7", "personal-material", "feng-yurao"],
    relatedQuestions: [],
    createdAt: now,
    updatedAt: now,
    children: mainSeeds.map(mainNode)
  }
];
