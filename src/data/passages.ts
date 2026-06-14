import type { Passage } from '@/types'

export const passages: Passage[] = [
  {
    id: '1',
    title: 'The Quick Brown Fox',
    content: 'The quick brown fox jumps over the lazy dog. This pangram contains every letter of the English alphabet at least once. Practice typing this sentence to improve your speed and accuracy with all keys.',
    language: 'en',
    difficulty: 1
  },
  {
    id: '2',
    title: 'Programming Wisdom',
    content: 'Any fool can write code that a computer can understand. Good programmers write code that humans can understand. Clean code is not written by following a set of rules, but by cultivating a set of values and principles.',
    language: 'en',
    difficulty: 2
  },
  {
    id: '3',
    title: 'Technology Future',
    content: 'Artificial intelligence is transforming how we work and live. Machine learning algorithms can now recognize patterns in vast amounts of data, enabling breakthroughs in healthcare, finance, and transportation.',
    language: 'en',
    difficulty: 2
  },
  {
    id: '4',
    title: 'Nature Beauty',
    content: 'The sun rises slowly over the horizon, painting the sky in hues of orange and pink. Birds begin their morning songs while dew drops glisten on the grass. These quiet moments remind us of the beauty that surrounds us each day.',
    language: 'en',
    difficulty: 2
  },
  {
    id: '5',
    title: 'Space Exploration',
    content: 'Humanity continues to push the boundaries of space exploration. Rovers traverse the surface of Mars, telescopes peer into the depths of the universe, and scientists search for signs of life beyond our planet.',
    language: 'en',
    difficulty: 3
  },
  {
    id: '6',
    title: '学习编程',
    content: '学习编程需要耐心和毅力。每一行代码都是思维的结晶，每一个 bug 都是成长的机会。通过不断练习和实践，你将掌握这门强大的技能，创造出属于自己的精彩作品。',
    language: 'zh',
    difficulty: 2
  },
  {
    id: '7',
    title: '科技改变生活',
    content: '人工智能正在深刻改变我们的生活方式。智能手机让沟通无处不在，移动支付让消费更加便捷，自动驾驶让出行更加安全。科技的进步永无止境，未来充满无限可能。',
    language: 'zh',
    difficulty: 2
  },
  {
    id: '8',
    title: '读书的乐趣',
    content: '书籍是人类进步的阶梯。阅读能够开阔视野，增长见识，让我们跨越时空与伟大的思想家对话。在这个信息爆炸的时代，静下心来读一本好书，是对心灵最好的滋养。',
    language: 'zh',
    difficulty: 2
  },
  {
    id: '9',
    title: '健康生活',
    content: '健康是人生最宝贵的财富。每天保持适量运动，均衡饮食，充足睡眠，这些简单的习惯能够带来长期的益处。照顾好自己的身体，才能更好地追逐梦想，享受生活的美好。',
    language: 'zh',
    difficulty: 1
  },
  {
    id: '10',
    title: '团队合作',
    content: '一个人可以走得很快，但一群人可以走得更远。优秀的团队成员懂得相互信任、相互支持，在协作中发挥各自的优势，共同创造出超越个人能力的成就。',
    language: 'zh',
    difficulty: 3
  }
]

export function getRandomPassage(): Passage {
  const randomIndex = Math.floor(Math.random() * passages.length)
  return passages[randomIndex]
}

export function getPassageById(id: string): Passage | undefined {
  return passages.find(p => p.id === id)
}
