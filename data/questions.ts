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
  {
    id: "sliding-window",
    label: "Sliding Window",
    questions: [
      {
        id: "sliding-window-maximum",
        title: "Sliding Window Maximum",
        prompt: "Given an array of integers and a window size k, return the maximum value in each sliding window as it moves from the left to the right of the array.",
      },
      {
        id: "longest-repeating-character-replacement",
        title: "Longest Repeating Character Replacement",
        prompt: "Given a string and an integer k, find the length of the longest substring containing the same letter after replacing at most k characters in the string.",
      },
      {
        id: "minimum-window-substring",
        title: "Minimum Window Substring",
        prompt: "Given two strings s and t, find the minimum window substring of s such that every character in t (including duplicates) is included in the window.",
      },
    ],
  },
  {
    id: "stack",
    label: "Stack",
    questions: [
      {
        id: "valid-parentheses",
        title: "Valid Parentheses",
        prompt: "Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      },
      {
        id: "min-stack",
        title: "Min Stack",
        prompt: "Design a stack that supports push, pop, top, and retrieving the minimum element, all in constant time.",
      },
      {
        id: "evaluate-reverse-polish-notation",
        title: "Evaluate Reverse Polish Notation",
        prompt: "Evaluate the value of an arithmetic expression given in Reverse Polish Notation, where valid operators are +, -, *, and /.",
      },
    ],
  },
  {
    id: "binary-search",
    label: "Binary Search",
    questions: [
      {
        id: "binary-search",
        title: "Binary Search",
        prompt: "Given a sorted array of integers and a target value, return the index of the target if it exists in the array, or -1 if it doesn't.",
      },
      {
        id: "search-in-rotated-sorted-array",
        title: "Search in Rotated Sorted Array",
        prompt: "Given a rotated sorted array of distinct integers and a target, return the index of the target, or -1 if it isn't present.",
      },
      {
        id: "find-minimum-in-rotated-sorted-array",
        title: "Find Minimum in Rotated Sorted Array",
        prompt: "Given a rotated sorted array of unique elements, find and return the minimum element in the array.",
      },
    ],
  },
  {
    id: "linked-list",
    label: "Linked List",
    questions: [
      {
        id: "reverse-linked-list",
        title: "Reverse Linked List",
        prompt: "Given the head of a singly linked list, reverse the list and return the new head.",
      },
      {
        id: "merge-two-sorted-lists",
        title: "Merge Two Sorted Lists",
        prompt: "Given the heads of two sorted linked lists, merge them into one sorted list and return its head.",
      },
      {
        id: "linked-list-cycle",
        title: "Linked List Cycle",
        prompt: "Given the head of a linked list, determine if the linked list has a cycle in it.",
      },
    ],
  },
  {
    id: "trees",
    label: "Trees",
    questions: [
      {
        id: "invert-binary-tree",
        title: "Invert Binary Tree",
        prompt: "Given the root of a binary tree, invert the tree so that it is the mirror of itself, and return its root.",
      },
      {
        id: "maximum-depth-of-binary-tree",
        title: "Maximum Depth of Binary Tree",
        prompt: "Given the root of a binary tree, return its maximum depth, i.e. the number of nodes along the longest path from the root down to the farthest leaf.",
      },
      {
        id: "validate-binary-search-tree",
        title: "Validate Binary Search Tree",
        prompt: "Given the root of a binary tree, determine if it is a valid binary search tree.",
      },
    ],
  },
  {
    id: "heap",
    label: "Heap / Priority Queue",
    questions: [
      {
        id: "kth-largest-element-in-an-array",
        title: "Kth Largest Element in an Array",
        prompt: "Given an integer array and an integer k, return the kth largest element in the array.",
      },
      {
        id: "top-k-frequent-elements",
        title: "Top K Frequent Elements",
        prompt: "Given an integer array and an integer k, return the k most frequent elements in the array.",
      },
      {
        id: "find-median-from-data-stream",
        title: "Find Median from Data Stream",
        prompt: "Design a data structure that supports adding integers one at a time and finding the median of all elements added so far.",
      },
    ],
  },
  {
    id: "graphs",
    label: "Graphs",
    questions: [
      {
        id: "number-of-islands",
        title: "Number of Islands",
        prompt: "Given a 2D grid of '1's (land) and '0's (water), count the number of islands, where an island is surrounded by water and formed by connecting adjacent land horizontally or vertically.",
      },
      {
        id: "clone-graph",
        title: "Clone Graph",
        prompt: "Given a reference to a node in a connected undirected graph, return a deep copy (clone) of the graph.",
      },
      {
        id: "course-schedule",
        title: "Course Schedule",
        prompt: "Given the total number of courses and a list of prerequisite pairs, determine if it's possible to finish all courses without a cyclic dependency.",
      },
    ],
  },
  {
    id: "intervals",
    label: "Intervals",
    questions: [
      {
        id: "merge-intervals",
        title: "Merge Intervals",
        prompt: "Given an array of intervals, merge all overlapping intervals and return an array of the non-overlapping intervals covering the input.",
      },
      {
        id: "insert-interval",
        title: "Insert Interval",
        prompt: "Given a set of non-overlapping intervals sorted by start time and a new interval, insert the new interval and merge if necessary.",
      },
      {
        id: "non-overlapping-intervals",
        title: "Non-overlapping Intervals",
        prompt: "Given an array of intervals, find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
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
