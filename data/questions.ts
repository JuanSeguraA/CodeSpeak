export type Question = {
  id: string
  title: string
  prompt: string
}

export type QuestionCategory = {
  id: string
  label: string
  questions: Question[]
}

export const QUESTION_CATEGORIES: QuestionCategory[] = [
  {
    id: "arrays",
    label: "Arrays",
    questions: [
      {
        id: "two-sum",
        title: "Two Sum",
        prompt: "Given an array of integers and a target, return the indices of the two numbers that add up to the target.",
      },
      {
        id: "max-subarray",
        title: "Maximum Subarray",
        prompt: "Given an integer array, find the contiguous subarray with the largest sum and return that sum.",
      },
      {
        id: "best-time-to-buy-sell-stock",
        title: "Best Time to Buy and Sell Stock",
        prompt: "Given an array of prices where prices[i] is the price on day i, find the maximum profit achievable by buying on one day and selling on a later day.",
      },
    ],
  },
  {
    id: "two-pointers",
    label: "Two Pointers",
    questions: [
      {
        id: "reverse-string",
        title: "Reverse a String",
        prompt: "Write a function that reverses a string in place.",
      },
      {
        id: "valid-palindrome",
        title: "Valid Palindrome",
        prompt: "Given a string, determine if it's a palindrome, considering only alphanumeric characters and ignoring case.",
      },
      {
        id: "container-with-most-water",
        title: "Container With Most Water",
        prompt: "Given an array of heights representing vertical lines, find the two lines that, together with the x-axis, form a container holding the most water.",
      },
    ],
  },
  {
    id: "backtracking",
    label: "Backtracking",
    questions: [
      {
        id: "subsets",
        title: "Subsets",
        prompt: "Given an array of unique integers, return all possible subsets (the power set).",
      },
      {
        id: "permutations",
        title: "Permutations",
        prompt: "Given an array of distinct integers, return all possible permutations.",
      },
      {
        id: "combination-sum",
        title: "Combination Sum",
        prompt: "Given an array of distinct integers and a target, return all unique combinations of numbers that sum to the target. A number may be used multiple times.",
      },
    ],
  },
  {
    id: "dynamic-programming",
    label: "Dynamic Programming",
    questions: [
      {
        id: "climbing-stairs",
        title: "Climbing Stairs",
        prompt: "You're climbing a staircase with n steps. Each time you can climb 1 or 2 steps. In how many distinct ways can you reach the top?",
      },
      {
        id: "coin-change",
        title: "Coin Change",
        prompt: "Given an array of coin denominations and a target amount, return the fewest number of coins needed to make that amount, or -1 if it can't be made.",
      },
      {
        id: "house-robber",
        title: "House Robber",
        prompt: "Given an array representing the money stashed in houses along a street, find the maximum amount you can rob without robbing two adjacent houses.",
      },
    ],
  },
  {
    id: "strings",
    label: "Strings",
    questions: [
      {
        id: "fizzbuzz",
        title: "FizzBuzz",
        prompt: "Print numbers 1 to 100. For multiples of 3, print 'Fizz'; for multiples of 5, print 'Buzz'; for multiples of both, print 'FizzBuzz'.",
      },
      {
        id: "valid-anagram",
        title: "Valid Anagram",
        prompt: "Given two strings, determine if the second string is an anagram of the first.",
      },
      {
        id: "longest-substring-without-repeating",
        title: "Longest Substring Without Repeating Characters",
        prompt: "Given a string, find the length of the longest substring that doesn't contain any repeating characters.",
      },
    ],
  },
]

export function findQuestionById(id: string): Question | undefined {
  for (const category of QUESTION_CATEGORIES) {
    const found = category.questions.find((q) => q.id === id)
    if (found) return found
  }
  return undefined
}
