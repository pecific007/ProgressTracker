package main

type Status string
type Difficulty string
type Subject string

var AllStatus = []Status{"solved", "pending"}

func isValidStatus(s string) bool {
	for _, st := range AllStatus {
		if string(st) == s {
			return true
		}
	}
	return false
}

var AllDifficulties = []Difficulty{
	"unknown", "easy", "medium", "hard",
}

func isValidDifficulty(d string) bool {
	for _, df := range AllDifficulties {
		if string(df) == d {
			return true
		}
	}
	return false
}

var AllSubjects = []Subject{
	"unknown",
	// Array/Strings
	"two_pointers", "sliding_window", "prefix_sum",
	"fast_&_slow_pointers", "merge_intervals", "Kadanes's_algorithm",
	// Searching
	"binary_search", "binary_search_on_answer",
	// Sorting		 // Linked Lists
	"sorting_based", "linked_listst",
	// Trees
	"tree_traversal", "tree_BFS", "binary_search_tree_ops", "trie",
	// Graphs
	"DFS", "BFS", "union_find", "topological_srot", "Dijkstra's", "minimum_spanning_tree",
	// Recursion
	"backtracking", "divide_and_conquer",
	// DP --> Dynamic Programming
	"1d_dynamic_programming", "2d_dynamic_programming", "Knapsack_(0/1_and_unbounded)", "dynamic_programming_on_strings",
	// Stack/Queue
	"monotonic_stack", "stack", "heap/priorit_queue",
	// Others
	"bit_manipulation", "greedy", "math's/number_theory",
}

func isValidSubject(s string) bool {
	for _, st := range AllSubjects {
		if string(st) == s {
			return true
		}
	}
	return false
}
