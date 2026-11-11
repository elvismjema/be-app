import type { DailyVerse } from '@/types'

const verses: DailyVerse[] = [
  { reference: 'Song of Solomon 3:4', text: 'I found the one my heart loves.' },
  { reference: '1 Corinthians 13:7', text: 'Love bears all things, believes all things, hopes all things, endures all things.' },
  { reference: 'Jeremiah 29:11', text: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.' },
  { reference: 'Proverbs 17:17', text: 'A friend loves at all times, and a brother is born for a time of adversity.' },
  { reference: '1 John 4:18', text: 'There is no fear in love. But perfect love drives out fear.' },
  { reference: 'Romans 8:38-39', text: 'Neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers, neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God.' },
  { reference: 'Ecclesiastes 4:9', text: 'Two are better than one, because they have a good return for their labor.' },
  { reference: 'Colossians 3:14', text: 'And over all these virtues put on love, which binds them all together in perfect unity.' },
  { reference: 'Ruth 1:16', text: 'Where you go I will go, and where you stay I will stay.' },
  { reference: 'Psalms 37:4', text: 'Take delight in the Lord, and he will give you the desires of your heart.' },
  { reference: '1 Peter 4:8', text: 'Above all, love each other deeply, because love covers over a multitude of sins.' },
  { reference: 'Hebrews 10:24', text: 'And let us consider how we may spur one another on toward love and good deeds.' },
  { reference: 'Zephaniah 3:17', text: 'The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.' },
  { reference: 'Isaiah 41:10', text: 'So do not fear, for I am with you; do not be dismayed, for I am your God. I will strengthen you and help you.' },
  { reference: 'Philippians 4:13', text: 'I can do all this through him who gives me strength.' },
  { reference: 'Song of Solomon 8:7', text: 'Many waters cannot quench love; rivers cannot sweep it away.' },
  { reference: '1 Corinthians 13:4-5', text: 'Love is patient, love is kind. It does not envy, it does not boast, it is not proud. It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.' },
  { reference: 'Proverbs 31:10', text: 'A wife of noble character who can find? She is worth far more than rubies.' },
  { reference: 'Ecclesiastes 4:12', text: 'Though one may be overpowered, two can defend themselves. A cord of three strands is not quickly broken.' },
  { reference: 'Genesis 2:24', text: 'That is why a man leaves his father and mother and is united to his wife, and they become one flesh.' },
  { reference: 'Psalms 23:1', text: 'The Lord is my shepherd, I lack nothing.' },
  { reference: 'Matthew 19:6', text: 'So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate.' },
  { reference: 'Romans 15:13', text: 'May the God of hope fill you with all joy and peace as you trust in him, so that you may overflow with hope by the power of the Holy Spirit.' },
  { reference: 'Ephesians 3:17', text: 'And I pray that you, being rooted and established in love, may have power.' },
  { reference: 'Lamentations 3:22-23', text: 'Because of the Lord\'s great love we are not consumed, for his compassions never fail. They are new every morning; great is your faithfulness.' },
  { reference: 'Psalms 139:14', text: 'I praise you because I am fearfully and wonderfully made; your works are wonderful, I know that full well.' },
  { reference: 'James 1:17', text: 'Every good and perfect gift is from above, coming down from the Father of the heavenly lights.' },
  { reference: 'John 15:13', text: 'Greater love has no one than this: to lay down one\'s life for one\'s friends.' },
  { reference: 'Proverbs 18:22', text: 'He who finds a wife finds what is good and receives favor from the Lord.' },
  { reference: 'Isaiah 43:4', text: 'Since you are precious and honored in my sight, and because I love you.' },
]

export function getDailyVerse(): DailyVerse {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return verses[dayOfYear % verses.length]
}
