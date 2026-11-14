export type PersonalityType = 'sanguine' | 'choleric' | 'melancholy' | 'phlegmatic'

export interface TraitWord {
  word: string
  type: PersonalityType
  definition: string
}

export interface TraitRow {
  row: number
  section: 'strengths' | 'weaknesses'
  words: TraitWord[]
}

export const PERSONALITY_TYPES: Record<PersonalityType, {
  name: string
  emoji: string
  tagline: string
  description: string
  color: string
}> = {
  sanguine: {
    name: 'The Sunshine',
    emoji: '☀️',
    tagline: 'Popular Sanguine',
    description: "You light up every room. Social, spontaneous, and endlessly optimistic — you bring warmth and laughter wherever you go. Life is an adventure to enjoy, and you make sure everyone around you feels that.",
    color: 'from-amber-500 to-orange-500',
  },
  choleric: {
    name: 'The Trailblazer',
    emoji: '⚡',
    tagline: 'Powerful Choleric',
    description: "Born to lead. You see a problem and immediately think about how to fix it. Driven and decisive, you get things done and naturally inspire others to follow you.",
    color: 'from-red-500 to-rose-600',
  },
  melancholy: {
    name: 'The Deep Soul',
    emoji: '🌙',
    tagline: 'Perfect Melancholy',
    description: "Thoughtful and perceptive. You feel things deeply and think even deeper. Your attention to detail and genuine care for others make you someone people trust completely.",
    color: 'from-blue-500 to-indigo-600',
  },
  phlegmatic: {
    name: 'The Anchor',
    emoji: '🌊',
    tagline: 'Peaceful Phlegmatic',
    description: "Steady and unshakeable. You're the calm in any storm — patient, reliable, and easy to be around. People feel safe with you, and that's a rare and beautiful gift.",
    color: 'from-green-500 to-teal-600',
  },
}

export const QUIZ_ROWS: TraitRow[] = [
  // STRENGTHS (1-20)
  { row: 1, section: 'strengths', words: [
    { word: 'Animated', type: 'sanguine', definition: 'Full of life and expression; uses gestures and energy to draw people in.' },
    { word: 'Adventurous', type: 'choleric', definition: 'Eager to take risks; sees challenges as opportunities, not threats.' },
    { word: 'Analytical', type: 'melancholy', definition: 'Thinks carefully before acting; always looking for the deeper reason behind things.' },
    { word: 'Adaptable', type: 'phlegmatic', definition: 'Comfortable in almost any situation; goes with the flow without complaining.' },
  ]},
  { row: 2, section: 'strengths', words: [
    { word: 'Playful', type: 'sanguine', definition: 'Keeps things fun and light; brings humor and games into everyday moments.' },
    { word: 'Persuasive', type: 'choleric', definition: 'Skilled at convincing others; communicates ideas with clarity and confidence.' },
    { word: 'Persistent', type: 'melancholy', definition: 'Keeps going even when it\'s hard; doesn\'t give up on what matters.' },
    { word: 'Peaceful', type: 'phlegmatic', definition: 'Creates a calm atmosphere; avoids conflict and keeps things harmonious.' },
  ]},
  { row: 3, section: 'strengths', words: [
    { word: 'Sociable', type: 'sanguine', definition: 'Genuinely loves being around people; makes friends effortlessly wherever they go.' },
    { word: 'Strong-willed', type: 'choleric', definition: 'Determined to reach goals; not easily swayed by others\' doubts or opinions.' },
    { word: 'Self-sacrificing', type: 'melancholy', definition: 'Puts others\' needs first; deeply committed to helping the people they love.' },
    { word: 'Submissive', type: 'phlegmatic', definition: 'Willing to let others lead; prioritizes harmony over being right.' },
  ]},
  { row: 4, section: 'strengths', words: [
    { word: 'Convincing', type: 'sanguine', definition: 'Naturally persuasive through charm and energy; people believe in them.' },
    { word: 'Competitive', type: 'choleric', definition: 'Motivated by winning; pushes themselves and others to perform at their best.' },
    { word: 'Considerate', type: 'melancholy', definition: 'Thinks about how actions affect others; thoughtful and caring in relationships.' },
    { word: 'Controlled', type: 'phlegmatic', definition: 'Keeps emotions steady; rarely overreacts, stays grounded under pressure.' },
  ]},
  { row: 5, section: 'strengths', words: [
    { word: 'Refreshing', type: 'sanguine', definition: 'Brings new energy and perspective; makes dull moments feel exciting again.' },
    { word: 'Resourceful', type: 'choleric', definition: 'Finds creative solutions fast; makes the most of whatever\'s available.' },
    { word: 'Respectful', type: 'melancholy', definition: 'Treats people with real dignity; takes others\' feelings and boundaries seriously.' },
    { word: 'Reserved', type: 'phlegmatic', definition: 'Quiet and thoughtful; prefers listening over speaking in a crowd.' },
  ]},
  { row: 6, section: 'strengths', words: [
    { word: 'Spirited', type: 'sanguine', definition: 'Full of passion and excitement; brings energy to everything they do.' },
    { word: 'Self-reliant', type: 'choleric', definition: 'Confident in their own abilities; doesn\'t need validation or direction from others.' },
    { word: 'Sensitive', type: 'melancholy', definition: 'Attuned to emotions; picks up on feelings others completely miss.' },
    { word: 'Satisfied', type: 'phlegmatic', definition: 'Content with what they have; doesn\'t constantly want something different.' },
  ]},
  { row: 7, section: 'strengths', words: [
    { word: 'Promoter', type: 'sanguine', definition: 'Naturally hypes things up; gets others excited about ideas and possibilities.' },
    { word: 'Positive', type: 'choleric', definition: 'Believes things will work out; keeps pushing forward with full confidence.' },
    { word: 'Planner', type: 'melancholy', definition: 'Thinks ahead and prepares; likes having a clear roadmap before starting.' },
    { word: 'Patient', type: 'phlegmatic', definition: 'Waits without frustration; handles delays and setbacks with real ease.' },
  ]},
  { row: 8, section: 'strengths', words: [
    { word: 'Spontaneous', type: 'sanguine', definition: 'Acts on impulse in the best way; makes life feel exciting and unpredictable.' },
    { word: 'Sure', type: 'choleric', definition: 'Certain of their decisions; rarely second-guesses once their mind is made up.' },
    { word: 'Scheduled', type: 'melancholy', definition: 'Lives by a plan; feels most at ease when time is properly organized.' },
    { word: 'Shy', type: 'phlegmatic', definition: 'Takes time to warm up; thoughtful in new situations rather than rushing in.' },
  ]},
  { row: 9, section: 'strengths', words: [
    { word: 'Optimistic', type: 'sanguine', definition: 'Sees the good in everything; believes better days are always just ahead.' },
    { word: 'Outspoken', type: 'choleric', definition: 'Says what they think directly; not afraid to voice opinions in any room.' },
    { word: 'Orderly', type: 'melancholy', definition: 'Keeps things neat and in their place; disorder genuinely makes them uncomfortable.' },
    { word: 'Obliging', type: 'phlegmatic', definition: 'Happy to help however needed; rarely says no when someone asks for something.' },
  ]},
  { row: 10, section: 'strengths', words: [
    { word: 'Funny', type: 'sanguine', definition: 'Has a natural sense of humor; makes people laugh without even trying.' },
    { word: 'Forceful', type: 'choleric', definition: 'Gets their point across with real authority; not easily ignored or dismissed.' },
    { word: 'Faithful', type: 'melancholy', definition: 'Deeply loyal and consistent; can always be counted on to follow through.' },
    { word: 'Friendly', type: 'phlegmatic', definition: 'Warm and easy to approach; makes everyone feel welcome and at ease.' },
  ]},
  { row: 11, section: 'strengths', words: [
    { word: 'Delightful', type: 'sanguine', definition: 'A joy to be around; their personality naturally makes others feel good.' },
    { word: 'Daring', type: 'choleric', definition: 'Willing to take bold risks; not held back by fear of failure or judgment.' },
    { word: 'Detailed', type: 'melancholy', definition: 'Notices everything others miss; produces thorough, carefully crafted work.' },
    { word: 'Diplomatic', type: 'phlegmatic', definition: 'Navigates disagreements with grace; finds solutions both sides can accept.' },
  ]},
  { row: 12, section: 'strengths', words: [
    { word: 'Cheerful', type: 'sanguine', definition: 'Upbeat and positive almost always; their mood genuinely lifts the room.' },
    { word: 'Confident', type: 'choleric', definition: 'Believes in themselves; walks into any situation without self-doubt.' },
    { word: 'Cultured', type: 'melancholy', definition: 'Appreciates art, music, and depth; has refined and thoughtful tastes.' },
    { word: 'Consistent', type: 'phlegmatic', definition: 'Shows up the same way every day; reliable, steady, and even-keeled.' },
  ]},
  { row: 13, section: 'strengths', words: [
    { word: 'Inspiring', type: 'sanguine', definition: 'Motivates others just by being themselves; people want to follow their energy.' },
    { word: 'Independent', type: 'choleric', definition: 'Doesn\'t need direction from others; self-directed and driven by personal vision.' },
    { word: 'Idealistic', type: 'melancholy', definition: 'Holds high standards and big dreams; truly believes things can always be better.' },
    { word: 'Inoffensive', type: 'phlegmatic', definition: 'Avoids causing upset; chooses words and actions with real care.' },
  ]},
  { row: 14, section: 'strengths', words: [
    { word: 'Demonstrative', type: 'sanguine', definition: 'Open with affection; shows love and excitement freely and without hesitation.' },
    { word: 'Decisive', type: 'choleric', definition: 'Makes decisions quickly and confidently; doesn\'t get stuck overthinking.' },
    { word: 'Deep', type: 'melancholy', definition: 'Goes beyond the surface; thinks and feels on a profound, meaningful level.' },
    { word: 'Dry humor', type: 'phlegmatic', definition: 'Has a subtle, understated wit; funny without trying to be obvious about it.' },
  ]},
  { row: 15, section: 'strengths', words: [
    { word: 'Mixes easily', type: 'sanguine', definition: 'Comfortable with anyone; blends into any group without awkwardness.' },
    { word: 'Mover', type: 'choleric', definition: 'Gets things started and keeps momentum going; a natural initiator.' },
    { word: 'Musical', type: 'melancholy', definition: 'Has a deep appreciation for or ability in music; connects with it emotionally.' },
    { word: 'Mediator', type: 'phlegmatic', definition: 'Steps in to resolve conflict calmly; helps both sides find real common ground.' },
  ]},
  { row: 16, section: 'strengths', words: [
    { word: 'Talker', type: 'sanguine', definition: 'Communicates freely and naturally; always has something interesting to say.' },
    { word: 'Tenacious', type: 'choleric', definition: 'Holds on and pushes through; nothing stops them once they\'re truly committed.' },
    { word: 'Thoughtful', type: 'melancholy', definition: 'Considers deeply before speaking or acting; genuinely reflective and caring.' },
    { word: 'Tolerant', type: 'phlegmatic', definition: 'Accepts differences in others without judgment; rarely bothered by people.' },
  ]},
  { row: 17, section: 'strengths', words: [
    { word: 'Lively', type: 'sanguine', definition: 'Full of movement and energy; makes everything around them feel more alive.' },
    { word: 'Leader', type: 'choleric', definition: 'Naturally steps up to guide and direct; people look to them in a crowd.' },
    { word: 'Loyal', type: 'melancholy', definition: 'Stands by the people they love through anything; doesn\'t walk away easily.' },
    { word: 'Listener', type: 'phlegmatic', definition: 'Gives others their full attention; rarely interrupts and always hears people out.' },
  ]},
  { row: 18, section: 'strengths', words: [
    { word: 'Cute', type: 'sanguine', definition: 'Naturally charming and endearing; wins people over just with their personality.' },
    { word: 'Chief', type: 'choleric', definition: 'Takes charge in any situation; naturally assumes the authority role.' },
    { word: 'Chartmaker', type: 'melancholy', definition: 'Organizes information clearly; loves systems, plans, and visual structures.' },
    { word: 'Contented', type: 'phlegmatic', definition: 'Genuinely at peace with life; not chasing something they don\'t have.' },
  ]},
  { row: 19, section: 'strengths', words: [
    { word: 'Popular', type: 'sanguine', definition: 'Naturally well-liked; draws people in and builds friendships effortlessly.' },
    { word: 'Productive', type: 'choleric', definition: 'Gets more done than most; focused on output and real results every day.' },
    { word: 'Perfectionist', type: 'melancholy', definition: 'Holds high standards; not satisfied until everything is done exactly right.' },
    { word: 'Pleasant', type: 'phlegmatic', definition: 'Easy and enjoyable to be around; brings a calm, positive presence to any space.' },
  ]},
  { row: 20, section: 'strengths', words: [
    { word: 'Bouncy', type: 'sanguine', definition: 'Energetic and bubbly; springs back quickly and brings a light, free spirit.' },
    { word: 'Bold', type: 'choleric', definition: 'Courageous and direct; willing to do what others hesitate to try.' },
    { word: 'Behaved', type: 'melancholy', definition: 'Follows the right way of doing things; respectful of rules and expectations.' },
    { word: 'Balanced', type: 'phlegmatic', definition: 'Even-keeled and steady; keeps a healthy perspective on most things in life.' },
  ]},

  // WEAKNESSES (21-40)
  { row: 21, section: 'weaknesses', words: [
    { word: 'Brassy', type: 'sanguine', definition: 'Can be too loud or flashy; presence sometimes overwhelms the room.' },
    { word: 'Bossy', type: 'choleric', definition: 'Tells others what to do without being asked; can come across as controlling.' },
    { word: 'Bashful', type: 'melancholy', definition: 'Struggles to open up in social settings; holds back even when they have something to say.' },
    { word: 'Blank', type: 'phlegmatic', definition: 'Shows little emotion or reaction; can seem distant or checked out.' },
  ]},
  { row: 22, section: 'weaknesses', words: [
    { word: 'Undisciplined', type: 'sanguine', definition: 'Struggles to stick to routines; easily distracted from long-term goals.' },
    { word: 'Unsympathetic', type: 'choleric', definition: 'Has little patience for emotional problems; sees feelings as obstacles.' },
    { word: 'Unforgiving', type: 'melancholy', definition: 'Holds on to hurt for a long time; has real trouble letting go of wrongs.' },
    { word: 'Unenthusiastic', type: 'phlegmatic', definition: 'Hard to get excited; can seem unmotivated even about genuinely good things.' },
  ]},
  { row: 23, section: 'weaknesses', words: [
    { word: 'Repetitious', type: 'sanguine', definition: 'Tells the same stories or makes the same points over and over.' },
    { word: 'Resistant', type: 'choleric', definition: 'Pushes back against change or ideas that aren\'t theirs; hard to redirect.' },
    { word: 'Resentful', type: 'melancholy', definition: 'Keeps score of how they\'ve been treated; builds up bitterness quietly over time.' },
    { word: 'Reticent', type: 'phlegmatic', definition: 'Reluctant to share thoughts or feelings; stays quiet when they should speak up.' },
  ]},
  { row: 24, section: 'weaknesses', words: [
    { word: 'Forgetful', type: 'sanguine', definition: 'Loses track of details, plans, and commitments; lives too much in the present moment.' },
    { word: 'Frank', type: 'choleric', definition: 'Too blunt at times; honesty can come across as harsh or inconsiderate.' },
    { word: 'Fussy', type: 'melancholy', definition: 'Hard to please; bothered by imperfections that others wouldn\'t even notice.' },
    { word: 'Fearful', type: 'phlegmatic', definition: 'Worried about potential problems; caution sometimes turns into avoidance.' },
  ]},
  { row: 25, section: 'weaknesses', words: [
    { word: 'Interrupts', type: 'sanguine', definition: 'Jumps into conversations before others finish; too eager to share their thoughts.' },
    { word: 'Impatient', type: 'choleric', definition: 'Hates waiting; frustration builds quickly when things move too slowly.' },
    { word: 'Insecure', type: 'melancholy', definition: 'Doubts their own worth; needs reassurance even when they\'re doing really well.' },
    { word: 'Indecisive', type: 'phlegmatic', definition: 'Struggles to make decisions; waits so long for the right answer that nothing gets done.' },
  ]},
  { row: 26, section: 'weaknesses', words: [
    { word: 'Unpredictable', type: 'sanguine', definition: 'Moods and plans change fast; people never quite know what to expect from them.' },
    { word: 'Unaffectionate', type: 'choleric', definition: 'Not naturally warm or demonstrative; emotional closeness can feel awkward.' },
    { word: 'Unpopular', type: 'melancholy', definition: 'High standards and perfectionism can rub people the wrong way over time.' },
    { word: 'Uninvolved', type: 'phlegmatic', definition: 'Stands back too much; avoids taking part even when their input is needed.' },
  ]},
  { row: 27, section: 'weaknesses', words: [
    { word: 'Haphazard', type: 'sanguine', definition: 'Approaches tasks randomly; lacks a system and often leaves things incomplete.' },
    { word: 'Headstrong', type: 'choleric', definition: 'Digs in and refuses to budge, even when they\'re clearly in the wrong.' },
    { word: 'Hard to please', type: 'melancholy', definition: 'Rarely fully satisfied; keeps raising the bar in ways that frustrate others.' },
    { word: 'Hesitant', type: 'phlegmatic', definition: 'Pauses too long before acting; misses opportunities waiting to feel completely sure.' },
  ]},
  { row: 28, section: 'weaknesses', words: [
    { word: 'Permissive', type: 'sanguine', definition: 'Too easy-going with rules or boundaries; avoids conflict by letting things slide.' },
    { word: 'Proud', type: 'choleric', definition: 'Has a high opinion of themselves; can come across as arrogant without realizing it.' },
    { word: 'Pessimistic', type: 'melancholy', definition: 'Expects the worst; has genuine trouble seeing the bright side of a situation.' },
    { word: 'Plain', type: 'phlegmatic', definition: 'Keeps things simple to the point of being unexciting; avoids standing out.' },
  ]},
  { row: 29, section: 'weaknesses', words: [
    { word: 'Angered easily', type: 'sanguine', definition: 'Flares up quickly though it usually passes fast; emotions are always close to the surface.' },
    { word: 'Argumentative', type: 'choleric', definition: 'Loves a debate, sometimes too much; can turn a simple chat into a confrontation.' },
    { word: 'Alienated', type: 'melancholy', definition: 'Pulls away from others when hurt; retreats into isolation instead of opening up.' },
    { word: 'Aimless', type: 'phlegmatic', definition: 'Drifts without clear direction; needs an external push to set and pursue goals.' },
  ]},
  { row: 30, section: 'weaknesses', words: [
    { word: 'Naive', type: 'sanguine', definition: 'Trusts too easily; can be taken advantage of because they see the best in everyone.' },
    { word: 'Nervy', type: 'choleric', definition: 'Bold to the point of being pushy; crosses lines without noticing or caring.' },
    { word: 'Negative attitude', type: 'melancholy', definition: 'Default mode leans toward what\'s wrong rather than what\'s right.' },
    { word: 'Nonchalant', type: 'phlegmatic', definition: 'Too laid-back; comes across as not caring about things that actually matter.' },
  ]},
  { row: 31, section: 'weaknesses', words: [
    { word: 'Wants credit', type: 'sanguine', definition: 'Needs recognition for their contributions; can feel deeply underappreciated easily.' },
    { word: 'Workaholic', type: 'choleric', definition: 'Puts work above everything; has real trouble switching off or allowing rest.' },
    { word: 'Withdrawn', type: 'melancholy', definition: 'Goes quiet and pulls back when overwhelmed; hard to reach in difficult moments.' },
    { word: 'Worrier', type: 'phlegmatic', definition: 'Stresses quietly about things going wrong; anxiety builds without being expressed.' },
  ]},
  { row: 32, section: 'weaknesses', words: [
    { word: 'Talkative', type: 'sanguine', definition: 'Sometimes shares too much or talks over others; genuinely struggles to listen.' },
    { word: 'Tactless', type: 'choleric', definition: 'Says things without considering how they\'ll land; honesty without a filter.' },
    { word: 'Too sensitive', type: 'melancholy', definition: 'Takes things personally that weren\'t meant that way; hurt lingers a long time.' },
    { word: 'Timid', type: 'phlegmatic', definition: 'Holds back in situations that call for boldness; shrinks from confrontation.' },
  ]},
  { row: 33, section: 'weaknesses', words: [
    { word: 'Disorganized', type: 'sanguine', definition: 'Struggles to keep track of things; chaos has a way of following them around.' },
    { word: 'Domineering', type: 'choleric', definition: 'Takes over situations and conversations; others can end up feeling bulldozed.' },
    { word: 'Depressed', type: 'melancholy', definition: 'Falls into deep emotional lows; heaviness is a recurring and real challenge.' },
    { word: 'Doubtful', type: 'phlegmatic', definition: 'Questions whether things will actually work out; hard to build strong conviction.' },
  ]},
  { row: 34, section: 'weaknesses', words: [
    { word: 'Inconsistent', type: 'sanguine', definition: 'Hot and cold; enthusiasm fades fast and follow-through is hit or miss.' },
    { word: 'Intolerant', type: 'choleric', definition: 'Has little patience for inefficiency or failure — in themselves or in others.' },
    { word: 'Introvert', type: 'melancholy', definition: 'Recharges alone; too much social time drains them completely.' },
    { word: 'Indifferent', type: 'phlegmatic', definition: 'Doesn\'t seem to care either way; hard to motivate or move to action.' },
  ]},
  { row: 35, section: 'weaknesses', words: [
    { word: 'Messy', type: 'sanguine', definition: 'Leaves a trail of disorder; tidiness is rarely ever a priority.' },
    { word: 'Manipulative', type: 'choleric', definition: 'Skilled at steering situations and people to get the outcome they want.' },
    { word: 'Moody', type: 'melancholy', definition: 'Emotional state shifts without obvious reason; others can walk on eggshells.' },
    { word: 'Mumbles', type: 'phlegmatic', definition: 'Speaks quietly and unclearly; hard to hear or understand at times.' },
  ]},
  { row: 36, section: 'weaknesses', words: [
    { word: 'Show-off', type: 'sanguine', definition: 'Seeks attention and loves being the center; can overdo it without realizing.' },
    { word: 'Stubborn', type: 'choleric', definition: 'Refuses to change their position; holds their ground even when they should let go.' },
    { word: 'Skeptical', type: 'melancholy', definition: 'Doubts until proven; hard to convince without solid evidence or clear logic.' },
    { word: 'Slow', type: 'phlegmatic', definition: 'Takes a long time to get moving; their pace can frustrate people around them.' },
  ]},
  { row: 37, section: 'weaknesses', words: [
    { word: 'Loud', type: 'sanguine', definition: 'Volume up — always. Can overwhelm quieter personalities or sensitive situations.' },
    { word: 'Lord over others', type: 'choleric', definition: 'Uses position or personality to control; can make others feel small or unheard.' },
    { word: 'Loner', type: 'melancholy', definition: 'Prefers solitude; can shut people out without meaning to hurt them.' },
    { word: 'Lazy', type: 'phlegmatic', definition: 'Avoids effort when possible; can get too comfortable doing very little.' },
  ]},
  { row: 38, section: 'weaknesses', words: [
    { word: 'Scatterbrained', type: 'sanguine', definition: 'Jumps from thought to thought; loses focus quickly and misses important things.' },
    { word: 'Short-tempered', type: 'choleric', definition: 'Quick to anger; loses patience fast and sometimes says things they regret.' },
    { word: 'Suspicious', type: 'melancholy', definition: 'Assumes the worst about people\'s motives; hard to trust without clear proof.' },
    { word: 'Sluggish', type: 'phlegmatic', definition: 'Low energy and slow to respond; can seem checked out even when present.' },
  ]},
  { row: 39, section: 'weaknesses', words: [
    { word: 'Restless', type: 'sanguine', definition: 'Needs constant stimulation; boredom sets in fast and can cause trouble.' },
    { word: 'Rash', type: 'choleric', definition: 'Acts without thinking; decisions made in the moment often need to be undone.' },
    { word: 'Revengeful', type: 'melancholy', definition: 'Doesn\'t forget wrongs; can hold grudges and quietly seek to settle scores.' },
    { word: 'Reluctant', type: 'phlegmatic', definition: 'Hesitant to get involved or commit; always looking for a reason to hold back.' },
  ]},
  { row: 40, section: 'weaknesses', words: [
    { word: 'Changeable', type: 'sanguine', definition: 'Opinions and plans shift often; unpredictability is a regular feature of life with them.' },
    { word: 'Crafty', type: 'choleric', definition: 'Clever at getting what they want, sometimes through means that aren\'t entirely honest.' },
    { word: 'Critical', type: 'melancholy', definition: 'Quick to spot flaws in people and situations; judgment can sting even when accurate.' },
    { word: 'Compromising', type: 'phlegmatic', definition: 'Gives in too easily to avoid conflict; loses their own needs in the process.' },
  ]},
]
