/* Wayang Lingua Nusantara V5 data: ready-use EFL materials, rooms, rubrics, and tutors. */
const WLN_DATA = {
  appName: 'Wayang Lingua Nusantara',
  tagline: 'AI-Powered Wayang Storytelling for EFL Skills',
  copyright: 'Copyright © Dr. Joko Slamet',
  adminPin: 'JS2026',
  roles: ['Student', 'Lecturer', 'Admin'],
  levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
  skills: ['Listening', 'Speaking', 'Reading', 'Writing', 'Pronunciation', 'Intercultural Communication'],
  tutors: [
    {id:'semar', name:'Semar', title:'Wisdom Mentor', focus:'reflection, coherence, confidence, and academic tone', img:'assets/semar.png', greeting:'I help you make your English message meaningful, polite, and culturally wise.', prompts:['What value does the story teach?', 'How can your idea become clearer for a global audience?', 'Which sentence needs a stronger conclusion?']},
    {id:'gareng', name:'Gareng', title:'Grammar Guardian', focus:'sentence structure, tenses, articles, and accuracy', img:'assets/gareng.png', greeting:'I check your grammar carefully and explain the correction clearly.', prompts:['Check tense consistency.', 'Improve subject-verb agreement.', 'Correct articles and prepositions.']},
    {id:'petruk', name:'Petruk', title:'Pronunciation Coach', focus:'stress, intonation, rhythm, pauses, and intelligibility', img:'assets/petruk.png', greeting:'I help you speak naturally, confidently, and intelligibly.', prompts:['Mark stressed words.', 'Practice rising and falling intonation.', 'Reduce long pauses.']},
    {id:'bagong', name:'Bagong', title:'Vocabulary Booster', focus:'word choice, collocation, synonyms, and natural expressions', img:'assets/bagong.png', greeting:'I help you use stronger vocabulary from Wayang stories and daily communication.', prompts:['Replace simple words with richer vocabulary.', 'Use collocations.', 'Build a vocabulary notebook.']},
    {id:'dalang', name:'Dalang AI', title:'Performance Mentor', focus:'storytelling, voice control, narrative flow, and stage presence', img:'assets/dalang.png', greeting:'I guide your English performance as narrator, character, and storyteller.', prompts:['Open with a strong line.', 'Use expressive voice.', 'Close the story with a moral message.']},
    {id:'arjuna', name:'Arjuna', title:'Clarity and Diplomacy Mentor', focus:'polite speaking, persuasive ideas, and audience awareness', img:'assets/logo-emblem-5d.png', greeting:'I help you express noble ideas with calm and confident English.', prompts:['Make your opinion polite.', 'Support your answer with reason.', 'Speak with clarity.']},
    {id:'srikandi', name:'Srikandi', title:'Critical Courage Mentor', focus:'argumentation, debate, and empowered communication', img:'assets/logo-emblem-5d.png', greeting:'I help you defend your ideas with evidence and courage.', prompts:['State your claim clearly.', 'Add evidence.', 'Respond respectfully.']},
    {id:'bima', name:'Bima', title:'Fluency Strength Mentor', focus:'speaking stamina, fluency, and powerful delivery', img:'assets/logo-emblem-5d.png', greeting:'I help you speak with strength, directness, and sustained fluency.', prompts:['Speak for one minute.', 'Avoid unnecessary repetition.', 'Use action verbs.']},
    {id:'gatotkaca', name:'Gatotkaca', title:'Confidence Builder', focus:'presentation confidence, oral performance, and resilience', img:'assets/logo-emblem-5d.png', greeting:'I help you become brave when performing English in front of others.', prompts:['Practice your opening.', 'Use confident body language.', 'Recover from mistakes.']},
    {id:'kresna', name:'Kresna', title:'Strategic Communication Mentor', focus:'organization, strategy, intercultural sensitivity, and academic communication', img:'assets/logo-emblem-5d.png', greeting:'I help you organize your English for academic and international audiences.', prompts:['Organize your answer into points.', 'Connect culture to global context.', 'Use transitions.']}
  ],
  modules: [
    {
      week: 1, level: 'A1', title: 'Meeting the Wayang World', characters: ['Semar','Gareng','Petruk','Bagong'],
      theme: 'Identity, greetings, and cultural introduction',
      objectives: ['Introduce oneself and a Wayang character in simple English.', 'Recognize basic classroom and culture vocabulary.', 'Respond to greetings and simple questions.'],
      vocabulary: ['puppet','shadow','story','character','greeting','name','friend','teacher','culture','stage','hello','welcome'],
      listening: 'Welcome to the Wayang world. This is Semar. Semar is wise and kind. He helps people understand life. Today, you will introduce yourself and meet the characters. Say your name, your class, and one thing you like about stories.',
      reading: 'Wayang is a traditional storytelling art from Indonesia. In a Wayang performance, a dalang moves the puppets and tells a story. The audience learns about courage, kindness, respect, and wisdom. In English class, Wayang can help students speak, listen, read, and write through meaningful stories.',
      speakingTask: 'Introduce yourself as a new student in the Wayang theatre. Mention your name, your level, and your favorite character.',
      writingTask: 'Write 5–7 sentences introducing yourself and one Wayang character. Use simple present tense.',
      interculturalTask: 'Explain one reason why cultural stories are important for young learners.',
      assessment: 'Short self-introduction audio and written character profile.',
      roomAgenda: ['Orientation to Wayang Lingua Nusantara', 'Character introduction', 'A1 speaking circle', 'Exit ticket'],
      quiz: [
        {q:'Who tells the story in a Wayang performance?', options:['Audience','Dalang','Ticket officer','Singer only'], answer:1},
        {q:'Which word means a person in a story?', options:['Character','Grammar','Password','Report'], answer:0},
        {q:'Semar is described as...', options:['wise and kind','angry and silent','a room','a test'], answer:0},
        {q:'A greeting is used to...', options:['start communication','end a report only','delete files','count scores'], answer:0},
        {q:'The main skill in the speaking task is...', options:['introducing oneself','solving math','drawing maps','editing photos'], answer:0}
      ]
    },
    {
      week: 2, level: 'A1', title: 'Semar’s Wisdom: Daily Routines', characters: ['Semar'],
      theme: 'Simple present tense and daily activities',
      objectives: ['Describe daily routines using simple present tense.', 'Listen for time expressions.', 'Write a simple daily routine paragraph.'],
      vocabulary: ['wake up','study','practice','listen','read','write','speak','morning','afternoon','evening','usually','always'],
      listening: 'Semar wakes up early. He listens to people carefully. In the morning, he helps his friends. In the afternoon, he gives advice. In the evening, he reflects on the day. Semar teaches us to be patient and responsible.',
      reading: 'Semar has a simple but meaningful routine. He starts the day with reflection. He meets people and listens to their problems. He does not speak too much, but when he speaks, his words are useful. Students can learn from Semar by practicing English every day with patience.',
      speakingTask: 'Describe your daily English practice routine in 45 seconds.',
      writingTask: 'Write one paragraph about your daily routine and include at least six time expressions.',
      interculturalTask: 'Compare Semar’s patience with a good habit in your own learning culture.',
      assessment: 'Routine paragraph and oral routine report.',
      roomAgenda: ['Review simple present tense', 'Listening for routines', 'Pair speaking', 'Writing clinic'],
      quiz: [
        {q:'Which sentence uses simple present correctly?', options:['Semar wake early.','Semar wakes up early.','Semar waking early.','Semar woke tomorrow.'], answer:1},
        {q:'Which is a time expression?', options:['morning','puppet','culture','grammar'], answer:0},
        {q:'Semar teaches patience through...', options:['reflection and advice','noise and anger','fast answers only','no listening'], answer:0},
        {q:'“Usually” describes...', options:['frequency','place','object','color'], answer:0},
        {q:'The writing task asks for...', options:['one routine paragraph','a business letter','a poem only','a test report'], answer:0}
      ]
    },
    {
      week: 3, level: 'A2', title: 'The Punakawan Dialogue', characters: ['Gareng','Petruk','Bagong'],
      theme: 'Asking and answering questions',
      objectives: ['Form WH-questions accurately.', 'Respond to simple information questions.', 'Use conversational expressions in roleplay.'],
      vocabulary: ['why','where','when','who','what','how','because','maybe','certainly','problem','solution','joke'],
      listening: 'Gareng asks, “Why do we need to practice English?” Petruk answers, “Because we want to tell our stories to the world.” Bagong says, “How can we start?” Gareng replies, “We can start with one sentence every day.”',
      reading: 'The Punakawan often use humor to teach serious lessons. They ask questions, give advice, and help heroes understand ordinary people. In English learning, asking questions is important because it helps students clarify meaning and continue conversations.',
      speakingTask: 'Perform a three-character dialogue using at least six WH-questions.',
      writingTask: 'Write a 10-line dialogue between two Wayang characters who want to learn English.',
      interculturalTask: 'Discuss how humor can make learning easier and more respectful.',
      assessment: 'Dialogue performance with question accuracy checklist.',
      roomAgenda: ['WH-question workshop', 'Character dialogue practice', 'Pronunciation of question intonation', 'Mini performance'],
      quiz: [
        {q:'Which is a WH-question?', options:['Are you ready?','Where is the stage?','You are ready.','The stage is big.'], answer:1},
        {q:'“Because” is used to give...', options:['a reason','a name','a number','a color'], answer:0},
        {q:'The Punakawan often use...', options:['humor','silence only','formal tests only','math formulas'], answer:0},
        {q:'Question intonation can help listeners understand...', options:['that you ask something','that you draw something','that you delete something','that you sleep'], answer:0},
        {q:'The speaking task requires...', options:['six WH-questions','six photos','six passwords','six certificates'], answer:0}
      ]
    },
    {
      week: 4, level: 'A2', title: 'Arjuna’s Journey', characters: ['Arjuna','Kresna'],
      theme: 'Narrating past events',
      objectives: ['Use simple past tense to retell a journey.', 'Identify sequence markers.', 'Describe choices and consequences.'],
      vocabulary: ['journey','choice','arrived','met','asked','helped','decided','finally','first','then','after that','because'],
      listening: 'Arjuna started his journey before sunrise. First, he met Kresna and asked for advice. Then, he walked through the forest. After that, he faced a difficult choice. Finally, he learned that courage must be guided by wisdom.',
      reading: 'Arjuna’s journey is not only a physical journey. It is also a journey of learning. He must listen, think, and decide carefully. In English, we can retell a journey by using past verbs and sequence markers such as first, then, after that, and finally.',
      speakingTask: 'Retell Arjuna’s journey in one minute using five past-tense verbs.',
      writingTask: 'Write a 120-word narrative about a learning journey you experienced.',
      interculturalTask: 'Explain how wisdom guides courage in Indonesian stories and modern student life.',
      assessment: 'Narrative retelling and written learning journey.',
      roomAgenda: ['Past tense review', 'Sequence marker listening', 'Retelling rehearsal', 'Peer feedback'],
      quiz: [
        {q:'Which word is past tense?', options:['met','meet','meeting','meets'], answer:0},
        {q:'“Finally” is used to show...', options:['the last event','a character name','a grammar error','a room link'], answer:0},
        {q:'Arjuna asked Kresna for...', options:['advice','money only','a password','a badge'], answer:0},
        {q:'A journey narrative should have...', options:['ordered events','random words only','no verbs','no meaning'], answer:0},
        {q:'The writing task is about...', options:['a learning journey','an invoice','a menu','a weather report'], answer:0}
      ]
    },
    {
      week: 5, level: 'B1', title: 'Srikandi’s Courage', characters: ['Srikandi'],
      theme: 'Expressing opinion and giving reasons',
      objectives: ['State opinions using clear expressions.', 'Give reasons and examples.', 'Develop confident speaking.'],
      vocabulary: ['courage','opinion','reason','evidence','challenge','brave','respect','equal','support','believe','however','therefore'],
      listening: 'Srikandi believes that courage is not only physical strength. Courage is the ability to speak honestly, defend truth, and respect others. She says, “A brave person listens before arguing and gives reasons before judging.”',
      reading: 'Srikandi represents courage, discipline, and dignity. In modern classrooms, her story can help students practice opinion-giving. A good opinion is not only strong; it is also supported by reasons and examples. English learners can use expressions such as I believe, In my opinion, For example, and Therefore.',
      speakingTask: 'Give a one-minute opinion: “Courage is important for EFL learners.” Include two reasons.',
      writingTask: 'Write a 150-word opinion paragraph about courage in academic life.',
      interculturalTask: 'Relate Srikandi’s courage to gender respect and responsible communication.',
      assessment: 'Opinion speech and paragraph scored with claim-reason-example rubric.',
      roomAgenda: ['Opinion expressions', 'Srikandi listening note-taking', 'Speech rehearsal', 'Peer rubric'],
      quiz: [
        {q:'A good opinion should include...', options:['reasons and examples','only one word','no evidence','random jokes'], answer:0},
        {q:'“Therefore” shows...', options:['result','place','person','sound'], answer:0},
        {q:'Srikandi represents...', options:['courage','forgetfulness','silence only','a login form'], answer:0},
        {q:'Which expression states opinion?', options:['In my opinion','Under the table','At 7 a.m.','Because of'], answer:0},
        {q:'The speaking task asks for...', options:['two reasons','two passwords','two pictures','two rooms'], answer:0}
      ]
    },
    {
      week: 6, level: 'B1', title: 'Bima’s Strength and Responsibility', characters: ['Bima','Semar'],
      theme: 'Describing character and responsibility',
      objectives: ['Use adjectives to describe character.', 'Explain responsibility using modal verbs.', 'Connect moral values to real actions.'],
      vocabulary: ['strong','honest','responsible','loyal','protect','must','should','have to','promise','duty','discipline','integrity'],
      listening: 'Bima is strong, but Semar reminds him that strength must serve responsibility. Bima says, “I must protect my people.” Semar answers, “You should also protect your words, because words can hurt or heal.”',
      reading: 'Bima is often remembered for strength and honesty. However, strength without responsibility can become dangerous. In English, modal verbs such as must, should, and have to help us express obligation and advice. Students can use these forms to discuss academic integrity and responsible communication.',
      speakingTask: 'Explain three responsibilities of a student using must, should, and have to.',
      writingTask: 'Write a reflective paragraph: “Strength means responsibility.”',
      interculturalTask: 'Discuss how Bima’s strength can represent integrity in university learning.',
      assessment: 'Modal-verb speaking task and reflective writing.',
      roomAgenda: ['Character adjectives', 'Modal verbs', 'Integrity discussion', 'Reflection sharing'],
      quiz: [
        {q:'Which modal gives strong obligation?', options:['must','maybe','very','quickly'], answer:0},
        {q:'Bima is associated with...', options:['strength and honesty','weak grammar only','room settings','no value'], answer:0},
        {q:'“Should” is often used for...', options:['advice','a name','a password','a picture'], answer:0},
        {q:'Responsibility means...', options:['doing duties properly','avoiding all tasks','copying answers','hiding reports'], answer:0},
        {q:'The writing theme is...', options:['strength and responsibility','weather','shopping','transport'], answer:0}
      ]
    },
    {
      week: 7, level: 'B1', title: 'Gatotkaca’s Loyalty', characters: ['Gatotkaca'],
      theme: 'Listening for main ideas and details',
      objectives: ['Identify main ideas and supporting details.', 'Summarize a heroic episode.', 'Use loyalty-related vocabulary.'],
      vocabulary: ['loyal','sacrifice','protect','kingdom','hero','mission','danger','victory','defend','support','main idea','detail'],
      listening: 'Gatotkaca accepted a dangerous mission to protect the kingdom. The main idea of the story is loyalty. The details show his bravery, his sacrifice, and his promise to defend others even when the situation was difficult.',
      reading: 'A summary should include the main idea and important details. It should not copy every sentence. Gatotkaca’s story teaches loyalty and sacrifice. When students summarize, they must decide which details are necessary and which details can be omitted.',
      speakingTask: 'Summarize Gatotkaca’s mission in 60 seconds using the phrase “The main idea is...”',
      writingTask: 'Write a 120-word summary of the listening text and include three supporting details.',
      interculturalTask: 'Explain how loyalty can be positive but must be balanced with critical thinking.',
      assessment: 'Listening summary and detail-identification quiz.',
      roomAgenda: ['Main idea strategy', 'Detail note-taking', 'Summary practice', 'Listening quiz'],
      quiz: [
        {q:'The main idea of the listening is...', options:['loyalty','shopping','weather','passwords'], answer:0},
        {q:'A summary should include...', options:['main idea and key details','all words copied','no point','only one character name'], answer:0},
        {q:'Gatotkaca accepted...', options:['a dangerous mission','a cooking class','a forum password','a blank report'], answer:0},
        {q:'Supporting details should...', options:['explain the main idea','replace the title','hide information','delete the text'], answer:0},
        {q:'The speaking task is...', options:['a 60-second summary','a 5-hour lecture','a room creation form','a photo upload only'], answer:0}
      ]
    },
    {
      week: 8, level: 'B1', title: 'Mid-Semester Wayang Performance', characters: ['All Mentors'],
      theme: 'Integrated performance assessment',
      objectives: ['Perform a short Wayang-based English scene.', 'Use listening, speaking, reading, and writing together.', 'Reflect on progress using a portfolio.'],
      vocabulary: ['performance','portfolio','reflection','audience','scene','script','feedback','fluency','accuracy','confidence','gesture','voice'],
      listening: 'Before performing, listen to the model scene. Notice the speaker’s pauses, stress, and emotion. A good performance is clear, organized, and expressive. It also shows respect for culture and audience.',
      reading: 'A performance portfolio documents learning progress. It may include a script, rehearsal notes, teacher feedback, peer feedback, and reflection. In Wayang Lingua Nusantara, performance is not only entertainment. It is evidence of language development and intercultural communication.',
      speakingTask: 'Perform a 2-minute Wayang scene with one narrator and one character voice.',
      writingTask: 'Write a performance script and a 100-word reflection on your progress.',
      interculturalTask: 'Explain how performance can introduce Indonesian culture to international audiences.',
      assessment: 'Mid-semester performance portfolio with rubric.',
      roomAgenda: ['Script preparation', 'Breakout rehearsal', 'Live performance', 'Portfolio submission'],
      quiz: [
        {q:'A portfolio shows...', options:['learning progress','only attendance','only a password','nothing'], answer:0},
        {q:'A good performance should be...', options:['clear and expressive','silent and random','copied and hidden','unorganized'], answer:0},
        {q:'The speaking task lasts...', options:['2 minutes','2 seconds','2 days','2 months'], answer:0},
        {q:'Peer feedback is useful because it...', options:['helps improvement','removes learning','replaces practice','hides problems'], answer:0},
        {q:'This meeting integrates...', options:['multiple skills','only one button','only photos','no English'], answer:0}
      ]
    },
    {
      week: 9, level: 'B2', title: 'Kresna’s Strategy: Problem Solving', characters: ['Kresna','Arjuna'],
      theme: 'Problem-solution speaking and writing',
      objectives: ['Analyze a problem and propose solutions.', 'Use problem-solution structure.', 'Apply transition phrases in formal English.'],
      vocabulary: ['strategy','problem','solution','cause','effect','option','priority','recommend','consequence','alternative','in addition','as a result'],
      listening: 'Kresna does not answer problems with emotion. He asks, “What is the cause? What are the possible solutions? What consequence will follow each choice?” Arjuna learns that strategy means thinking before acting.',
      reading: 'A problem-solution text explains an issue, analyzes causes, proposes solutions, and evaluates consequences. This structure is useful in academic writing and public speaking. Kresna’s strategic wisdom helps students organize ideas logically before presenting them in English.',
      speakingTask: 'Present a problem-solution talk about improving English speaking confidence.',
      writingTask: 'Write a 180-word problem-solution paragraph using at least four transitions.',
      interculturalTask: 'Compare strategic thinking in Wayang stories with problem-solving in modern education.',
      assessment: 'Problem-solution oral presentation and structured paragraph.',
      roomAgenda: ['Problem-solution framework', 'Kresna listening analysis', 'Breakout solution design', 'Presentation'],
      quiz: [
        {q:'A problem-solution text should include...', options:['issue, causes, solutions, consequences','only jokes','only title','no organization'], answer:0},
        {q:'“As a result” shows...', options:['effect','character','place','voice'], answer:0},
        {q:'Kresna teaches...', options:['strategy','carelessness','copying','silence'], answer:0},
        {q:'A solution should be...', options:['reasonable and explained','hidden and random','unrelated','only a word'], answer:0},
        {q:'The writing length is...', options:['180 words','18 words','8000 words','no words'], answer:0}
      ]
    },
    {
      week: 10, level: 'B2', title: 'Leadership in the Pandawa Story', characters: ['Yudhistira','Bima','Arjuna'],
      theme: 'Comparing leadership values',
      objectives: ['Compare characters using comparative language.', 'Support interpretations with textual evidence.', 'Discuss leadership for global citizenship.'],
      vocabulary: ['leadership','justice','fairness','bravery','wisdom','comparison','whereas','while','similarly','unlike','evidence','interpretation'],
      listening: 'Each Pandawa leader shows a different strength. Yudhistira values justice, Bima values honesty, and Arjuna values focus. While they are different, they share loyalty and responsibility. Their leadership becomes stronger when they work together.',
      reading: 'Comparison helps learners understand differences and similarities. In academic English, writers use words such as whereas, while, similarly, and unlike. Wayang characters provide rich material for comparing values, decisions, and leadership styles.',
      speakingTask: 'Compare two Wayang characters and explain which leadership value is more relevant for students.',
      writingTask: 'Write a 200-word comparison paragraph using at least five comparison markers.',
      interculturalTask: 'Connect Wayang leadership values to global citizenship and ethical teamwork.',
      assessment: 'Comparison speech and evidence-based paragraph.',
      roomAgenda: ['Comparison language', 'Leadership debate', 'Evidence mapping', 'Paragraph conference'],
      quiz: [
        {q:'“Whereas” is used for...', options:['contrast','time only','passwords','photos'], answer:0},
        {q:'Yudhistira is linked with...', options:['justice','randomness','silence','room settings'], answer:0},
        {q:'Comparison includes...', options:['similarities and differences','only names','only colors','no support'], answer:0},
        {q:'Evidence helps make interpretation...', options:['stronger','weaker','invisible','unreadable'], answer:0},
        {q:'The writing task requires...', options:['comparison markers','breakout rooms only','login data','image editing'], answer:0}
      ]
    },
    {
      week: 11, level: 'B2', title: 'Debating Ethical Choices', characters: ['Srikandi','Kresna','Semar'],
      theme: 'Debate language and respectful disagreement',
      objectives: ['Use debate expressions politely.', 'Support claims with reasons and examples.', 'Respond to counterarguments respectfully.'],
      vocabulary: ['claim','counterargument','respectfully','agree','disagree','evidence','perspective','ethical','choice','consequence','however','nevertheless'],
      listening: 'Srikandi says, “I disagree, but I respect your reason.” Kresna replies, “Let us examine the consequence.” Semar reminds them, “A wise debate does not defeat people; it clarifies truth.”',
      reading: 'Debate in English requires both confidence and respect. Students need claims, evidence, and responses to opposing views. Ethical stories from Wayang help learners discuss complex issues without attacking others. This builds communicative competence and character.',
      speakingTask: 'Hold a structured debate: “Technology makes students more responsible.” Use claim, evidence, and response.',
      writingTask: 'Write a balanced argumentative paragraph with one counterargument.',
      interculturalTask: 'Discuss how respectful disagreement can strengthen academic culture.',
      assessment: 'Debate performance and argumentative paragraph.',
      roomAgenda: ['Debate expressions', 'Team preparation', 'Breakout argument planning', 'Live debate'],
      quiz: [
        {q:'A counterargument is...', options:['an opposing view','a room name','a photo','a greeting'], answer:0},
        {q:'A respectful debate should...', options:['clarify ideas','attack people','hide reasons','ignore evidence'], answer:0},
        {q:'“Nevertheless” shows...', options:['contrast','place','number','image'], answer:0},
        {q:'The speaking task requires...', options:['claim, evidence, response','only silence','only reading','only a password'], answer:0},
        {q:'Semar says wise debate clarifies...', options:['truth','games','colors','icons'], answer:0}
      ]
    },
    {
      week: 12, level: 'B2', title: 'Writing a Cultural Reflection', characters: ['Semar','Bagong'],
      theme: 'Reflective writing and intercultural awareness',
      objectives: ['Write reflective paragraphs with personal insight.', 'Use descriptive and evaluative language.', 'Connect local culture to global communication.'],
      vocabulary: ['reflection','insight','identity','heritage','perspective','global','local','meaningful','realize','appreciate','experience','connection'],
      listening: 'Bagong says, “I used to think stories were only entertainment.” Semar answers, “When you reflect, you can see that stories shape identity.” Bagong realizes that explaining Wayang in English helps him appreciate culture more deeply.',
      reading: 'Reflection is different from summary. A summary tells what happened, while reflection explains what the experience means. In intercultural English learning, reflection helps students understand their own culture and communicate it respectfully to others.',
      speakingTask: 'Share a 90-second reflection on what Wayang teaches about identity.',
      writingTask: 'Write a 250-word cultural reflection with one personal experience and one global connection.',
      interculturalTask: 'Explain how local identity can support global English communication.',
      assessment: 'Reflective speech and cultural reflection essay.',
      roomAgenda: ['Reflection vs summary', 'Listening analysis', 'Writing workshop', 'Peer response'],
      quiz: [
        {q:'Reflection explains...', options:['meaning and insight','only events','only spelling','only names'], answer:0},
        {q:'A summary mainly tells...', options:['what happened','why it matters deeply','a password','a room schedule'], answer:0},
        {q:'The writing task requires...', options:['personal experience and global connection','only a title','only a list','no example'], answer:0},
        {q:'Intercultural learning helps students...', options:['communicate culture respectfully','avoid culture','delete stories','ignore identity'], answer:0},
        {q:'Bagong realizes stories shape...', options:['identity','software only','prices','weather'], answer:0}
      ]
    },
    {
      week: 13, level: 'C1', title: 'Wayang and Global Communication', characters: ['Kresna','Dalang AI'],
      theme: 'Academic presentation and intercultural explanation',
      objectives: ['Deliver an academic mini-presentation.', 'Explain cultural concepts to international audiences.', 'Use signposting and academic vocabulary.'],
      vocabulary: ['heritage','interpretation','symbolic','representation','audience','signposting','firstly','moreover','in contrast','to conclude','implication','context'],
      listening: 'In this presentation, I will explain Wayang as a cultural storytelling system. Firstly, Wayang represents moral education. Moreover, it offers symbolic characters that help audiences discuss complex values. To conclude, Wayang can support global English communication by connecting heritage and language learning.',
      reading: 'Academic presentations require clear structure. Speakers should introduce the topic, preview main points, explain evidence, and conclude with implications. When presenting Wayang internationally, students must avoid assuming that listeners already understand the cultural context.',
      speakingTask: 'Deliver a 3-minute academic presentation explaining one Wayang value to international students.',
      writingTask: 'Prepare a presentation outline with introduction, three main points, evidence, and conclusion.',
      interculturalTask: 'Adapt one local cultural term for an audience unfamiliar with Indonesian heritage.',
      assessment: 'Academic presentation and structured outline.',
      roomAgenda: ['Presentation signposting', 'Audience adaptation', 'Slide outline clinic', 'Mini conference'],
      quiz: [
        {q:'Signposting helps listeners...', options:['follow structure','forget ideas','change password','ignore topic'], answer:0},
        {q:'“To conclude” introduces...', options:['closing','first evidence','a room','a question only'], answer:0},
        {q:'International audiences may need...', options:['cultural context','no explanation','only Indonesian terms','no examples'], answer:0},
        {q:'The speaking task is...', options:['a 3-minute academic presentation','a single word','a login action','a quiz only'], answer:0},
        {q:'An implication explains...', options:['why the idea matters','where the button is','who logs in','what color'], answer:0}
      ]
    },
    {
      week: 14, level: 'C1', title: 'Researching Wayang-Based EFL Learning', characters: ['Semar','Kresna'],
      theme: 'Research literacy and evidence-based learning',
      objectives: ['Describe a small classroom research plan.', 'Interpret simple learning analytics.', 'Use research vocabulary accurately.'],
      vocabulary: ['research','data','evidence','participant','instrument','finding','analysis','validity','reliability','ethics','consent','improvement'],
      listening: 'Kresna says that good teaching needs evidence. Semar adds that evidence must be collected ethically. Students can use pre-tests, post-tests, reflections, and performance portfolios to understand whether learning improves.',
      reading: 'Research literacy helps learners and teachers understand learning progress. In an EFL app, data may include quiz scores, speaking recordings, writing drafts, feedback history, and attendance. Ethical use of data requires consent, privacy, and responsible reporting.',
      speakingTask: 'Explain a simple research plan for evaluating Wayang Lingua Nusantara in your class.',
      writingTask: 'Write a 250-word mini research proposal including objective, participants, data, and ethics.',
      interculturalTask: 'Discuss why local-culture-based apps should be evaluated with evidence.',
      assessment: 'Research-plan presentation and mini proposal.',
      roomAgenda: ['Research vocabulary', 'Analytics interpretation', 'Ethics discussion', 'Proposal sharing'],
      quiz: [
        {q:'Ethical data use requires...', options:['consent and privacy','public passwords','hidden identity theft','no responsibility'], answer:0},
        {q:'A participant is...', options:['a person involved in a study','a file type','a button','a color'], answer:0},
        {q:'Learning analytics may include...', options:['scores and activity data','only logos','only slogans','no evidence'], answer:0},
        {q:'Reliability relates to...', options:['consistency','random design','password length','image size'], answer:0},
        {q:'The writing task is...', options:['a mini research proposal','a food recipe','a room chat','a single sentence only'], answer:0}
      ]
    },
    {
      week: 15, level: 'C2', title: 'Creating a Modern Wayang Adaptation', characters: ['All Mentors'],
      theme: 'Creative adaptation and advanced storytelling',
      objectives: ['Adapt a traditional story for a modern audience.', 'Use advanced narrative techniques.', 'Justify creative choices in English.'],
      vocabulary: ['adaptation','reinterpretation','narrative','conflict','resolution','symbolism','voice','perspective','audience','creative choice','theme','transformation'],
      listening: 'A modern adaptation keeps the spirit of a traditional story while changing setting, conflict, or audience. The storyteller must decide what to preserve and what to transform. Good adaptation respects heritage but speaks to present concerns.',
      reading: 'Creative adaptation requires interpretation. Writers identify core values, select a new context, design characters, and develop conflict and resolution. In English learning, adaptation encourages vocabulary growth, narrative control, intercultural explanation, and audience awareness.',
      speakingTask: 'Pitch a modern Wayang adaptation in 3 minutes and justify your creative choices.',
      writingTask: 'Write a 500-word modern adaptation of a Wayang story for global youth readers.',
      interculturalTask: 'Explain how adaptation can preserve heritage while allowing innovation.',
      assessment: 'Creative pitch and written adaptation manuscript.',
      roomAgenda: ['Adaptation models', 'Story design breakout', 'Pitch rehearsal', 'Peer review'],
      quiz: [
        {q:'Adaptation means...', options:['transforming a story for a new context','copying without change','deleting culture','only translating words'], answer:0},
        {q:'A good adaptation should respect...', options:['heritage','only trends','no values','passwords'], answer:0},
        {q:'Conflict and resolution are parts of...', options:['narrative structure','login forms','charts only','room settings'], answer:0},
        {q:'The writing task asks for...', options:['500-word adaptation','one-word answer','a quiz report','profile photo'], answer:0},
        {q:'Creative choices should be...', options:['justified','hidden','random','unexplained'], answer:0}
      ]
    },
    {
      week: 16, level: 'C2', title: 'Final Global Wayang English Showcase', characters: ['All Mentors'],
      theme: 'Final performance, portfolio, and research passport',
      objectives: ['Perform a polished Wayang-based English project.', 'Submit complete learning portfolio.', 'Generate a research-ready learning report.'],
      vocabulary: ['showcase','achievement','portfolio','evidence','reflection','performance','global audience','feedback','mastery','growth','impact','publication'],
      listening: 'This is the final showcase. Each learner presents a Wayang-based English project for a global audience. The performance should demonstrate clarity, fluency, cultural explanation, creativity, and confidence. The portfolio becomes evidence of learning growth.',
      reading: 'The final showcase brings together the full learning journey. Students submit scripts, recordings, written work, quiz evidence, reflections, and AI mentor feedback. Teachers use the research passport to review progress and prepare evidence-based reports for teaching improvement and publication.',
      speakingTask: 'Deliver a 5-minute final Wayang English showcase with introduction, performance, and reflection.',
      writingTask: 'Submit a final reflective portfolio: learning growth, cultural understanding, and future English goals.',
      interculturalTask: 'Explain Wayang to a global audience and connect it to one universal value.',
      assessment: 'Final performance, complete portfolio, and research passport report.',
      roomAgenda: ['Final rehearsal', 'Live showcase', 'Portfolio verification', 'Certificate and report export'],
      quiz: [
        {q:'The final showcase demonstrates...', options:['integrated English skills and culture','only attendance','only login','only design'], answer:0},
        {q:'A research passport contains...', options:['learning evidence','food menu','password list','private keys'], answer:0},
        {q:'The performance should be...', options:['clear, fluent, cultural, creative','silent and hidden','unprepared','unrelated'], answer:0},
        {q:'The speaking task lasts...', options:['5 minutes','5 seconds','5 weeks','no time'], answer:0},
        {q:'The portfolio supports...', options:['achievement evidence','no learning','random display','only branding'], answer:0}
      ]
    }
  ],
  rubrics: [
    {criteria:'Content and Cultural Meaning', excellent:'Accurate, meaningful, culturally respectful, globally understandable.', good:'Mostly accurate and meaningful with minor gaps.', fair:'Basic cultural explanation with limited connection.', needs:'Unclear, inaccurate, or culturally superficial.'},
    {criteria:'Language Accuracy', excellent:'Consistent grammar control with varied structures.', good:'Minor errors but meaning is clear.', fair:'Frequent errors sometimes affect clarity.', needs:'Errors often block understanding.'},
    {criteria:'Fluency and Pronunciation', excellent:'Smooth, intelligible, expressive, effective stress and pauses.', good:'Mostly clear with occasional hesitation.', fair:'Understandable but hesitant or flat.', needs:'Difficult to understand; needs more rehearsal.'},
    {criteria:'Organization and Coherence', excellent:'Clear opening, logical sequence, effective conclusion.', good:'Generally organized with some transitions.', fair:'Some organization but uneven flow.', needs:'Disorganized or incomplete.'},
    {criteria:'Engagement and Creativity', excellent:'Engaging, confident, creative, audience-aware.', good:'Clear effort and some audience awareness.', fair:'Limited expression or creativity.', needs:'Minimal engagement.'}
  ],
  roomTemplates: [
    {roomType:'Main Class', mode:'Open Join', capacity:120, tools:['Video meeting','Class chat','Screen share','Breakout rooms','Attendance log','Session notes']},
    {roomType:'Speaking Clinic', mode:'Open Join', capacity:40, tools:['Roleplay seats','Audio rehearsal','Pronunciation notes','Peer feedback']},
    {roomType:'Writing Studio', mode:'Open Join', capacity:60, tools:['Draft review','Mentor feedback','Rubric scoring','Portfolio upload']},
    {roomType:'Research Consultation', mode:'Open Join', capacity:30, tools:['Analytics review','Report export','Ethics reminder','Publication notes']}
  ],
  assessmentTypes: ['Listening comprehension', 'Speaking performance', 'Reading response', 'Writing production', 'Intercultural reflection', 'Portfolio evidence', 'Final showcase']
};
