export const COMPLEXITIES = ["Easy", "Medium", "Hard"];

export const CATEGORIES = [
    "Strings",
    "Algorithms",
    "Data Structures",
    "Bit Manipulation",
    "Recursion",
    "Databases",
    "Brainteaser",
    "Arrays",
];

export const SAMPLE_QUESTIONS = [
    {
        id: 1,
        title: "Reverse a String",
        description: `Write a function that reverses a string. The input string is given as an array of characters s.
        You must do this by modifying the input array in-place with O(1) extra memory.
        
        Example 1:
        Input: s = ["h","e","l","l","o"]
        Output: ["o","l","l","e","h"]
        
        Example 2:
        Input: s = ["H","a","n","n","a","h"]
        Output: ["h","a","n","n","a","H"]
        
        Constraints:
        1 <= s.length <= 10^5
        s[i] is a printable ASCII character.`,
        categories: ["Strings", "Algorithms"],
        complexity: "Easy",
    },
    {
        id: 2,
        title: "Linked List Cycle Detection",
        description: `Implement a function to detect if a linked list contains a cycle.`,
        categories: ["Data Structures", "Algorithms"],
        complexity: "Easy",
    },
    {
        id: 3,
        title: "Roman to Integer",
        description: `Given a Roman numeral, convert it to an integer.`,
        categories: ["Algorithms"],
        complexity: "Easy",
    },
    {
        id: 4,
        title: "Add Binary",
        description: `Given two binary strings a and b, return their sum as a binary string.`,
        categories: ["Bit Manipulation", "Algorithms"],
        complexity: "Easy",
    },
    {
        id: 5,
        title: "Fibonacci Number",
        description: `The Fibonacci numbers, commonly denoted F(n), form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1.
        
        That is,
        F(0) = 0, F(1) = 1
        F(n) = F(n - 1) + F(n - 2), for n > 1.
        
        Given n, calculate F(n).`,
        categories: ["Recursion", "Algorithms"],
        complexity: "Easy",
    },
    {
        id: 6,
        title: "Implement Stack using Queues",
        description: `Implement a last-in-first-out (LIFO) stack using only two queues. The implemented stack should support all the functions of a normal stack (push, top, pop, and empty).`,
        categories: ["Data Structures"],
        complexity: "Easy",
    },
    {
        id: 7,
        title: "Combine Two Tables",
        description: `Given table Person with the following columns:
        1. personId (int)
        2. lastName (varchar)
        3. firstName (varchar)
        
        And table Address with the following columns:
        1. addressId (int)
        2. personId (int)
        3. city (varchar)
        4. state (varchar)
        
        Write a solution to report the first name, last name, city, and state of each person in the Person table. If the address of a personId is not present in the Address table, report null instead.`,
        categories: ["Databases"],
        complexity: "Easy",
    },
    {
        id: 8,
        title: "Repeated DNA Sequences",
        description: `The DNA sequence is composed of a series of nucleotides abbreviated as 'A', 'C', 'G', and 'T'.
        
        Given a string s that represents a DNA sequence, return all the 10-letter-long sequences (substrings) that occur more than once in a DNA molecule.`,
        categories: ["Algorithms", "Bit Manipulation"],
        complexity: "Medium",
    },
    {
        id: 9,
        title: "Course Schedule",
        description: `There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai.
        
        Return true if you can finish all courses. Otherwise, return false.`,
        categories: ["Data Structures", "Algorithms"],
        complexity: "Medium",
    },
    {
        id: 10,
        title: "LRU Cache Design",
        description: `Design and implement an LRU (Least Recently Used) cache.`,
        categories: ["Data Structures"],
        complexity: "Medium",
    },
    {
        id: 11,
        title: "Longest Common Subsequence",
        description: `Given two strings text1 and text2, return the length of their longest common subsequence.`,
        categories: ["Strings", "Algorithms"],
        complexity: "Medium",
    },
    {
        id: 12,
        title: "Rotate Image",
        description: `You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise).`,
        categories: ["Arrays", "Algorithms"],
        complexity: "Medium",
    },
    {
        id: 13,
        title: "Airplane Seat Assignment Probability",
        description: `n passengers board an airplane with exactly n seats. The first passenger has lost the ticket and picks a seat randomly.
        
        Return the probability that the nth person gets his own seat.`,
        categories: ["Brainteaser"],
        complexity: "Medium",
    },
    {
        id: 14,
        title: "Validate Binary Search Tree",
        description: `Given the root of a binary tree, determine if it is a valid binary search tree (BST).`,
        categories: ["Data Structures", "Algorithms"],
        complexity: "Medium",
    },
    {
        id: 15,
        title: "Sliding Window Maximum",
        description: `You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right.
        
        Return the max sliding window.`,
        categories: ["Arrays", "Algorithms"],
        complexity: "Hard",
    },
    {
        id: 16,
        title: "N-Queen Problem",
        description: `The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.
        
        Given an integer n, return all distinct solutions to the n-queens puzzle.`,
        categories: ["Algorithms"],
        complexity: "Hard",
    },
    {
        id: 17,
        title: "Serialize and Deserialize a Binary Tree",
        description: `Design an algorithm to serialize and deserialize a binary tree.`,
        categories: ["Data Structures", "Algorithms"],
        complexity: "Hard",
    },
    {
        id: 18,
        title: "Wildcard Matching",
        description: `Given an input string s and a pattern p, implement wildcard pattern matching with support for '?' and '*'.`,
        categories: ["Strings", "Algorithms"],
        complexity: "Hard",
    },
    {
        id: 19,
        title: "Chalkboard XOR Game",
        description: `You are given an array of integers nums represents the numbers written on a chalkboard.
        
        Return true if and only if Alice wins the game, assuming both players play optimally.`,
        categories: ["Brainteaser"],
        complexity: "Hard",
    },
    {
        id: 20,
        title: "Trips and Users",
        description: `Given table Trips and Users, find the cancellation rate of requests with unbanned users each day between "2013-10-01" and "2013-10-03". Round the result to two decimal points.`,
        categories: ["Databases"],
        complexity: "Hard",
    }
];

export const CODE_SNIPPETS = {
    javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
    python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
    csharp:
      'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
    php: "<?php\n\n$name = 'Alex';\necho $name;\n",
  };