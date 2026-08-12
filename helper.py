from enum import Enum


class Status(Enum):
    Solved = "solved"
    Pending = "pending"
    Unsolvable = "unsolvable"


class Difficulty(Enum):
    Hard = "hard"
    Medium = "medium"
    Easy = "easy"
    Idk = "unknown"


class Tags(Enum):
    unknown = "unknown"
    # Arrays/Strings
    two_pointers = "two pointers"
    sliding_window = "sliding window"
    prefix_sum = "prefix sum"
    fast_slow_pointers = "fast & slow pointers (cycle detection)"
    merge_intervals = "merge intervals"
    kadanes_algo = "Kadane's algorithm (max subarray)"

    # Searching
    binary_search = "binary search"
    binary_search_on_answer = "binary search on answer"

    # Sorting
    sorting_based = "sorting based"

    # Linked Lists
    linked_lists = "linked lists"

    # Trees
    tree_traversal = "tree traversal (DFS-based)"
    tree_bfs = "tree BFS"
    binary_search_tree_ops = "binary search tree ops"
    trie = "trie"

    # Graphs
    dfs = "DFS"
    bfs = "BFS"
    union_find = "union find (disjoint set)"
    topological_srot = "topological sort"
    dijkstra = "Dijkstra's algorithm"
    minimum_spanning_tree = "minimum spanning tree (Kruskal's/Prim's)"

    # Recursion
    backgracking = "backgracking"
    divide_and_conquer = "divide and conquer"

    # DP -- dynamic programming
    dp_1d = "1D dynamic programming"
    dp_2d = "2D dynamic programming"
    knapsack = "Knapsack (0/1 and unbounded)"
    dp_on_strs = "dynamic programming on strings"  # edit distance, LCS-style

    # Stacks/Queues
    monotonic = "monotonic stack"
    stack_based = "stack"
    heap_queue = "heap/priority queue"

    # Others
    bit_manupilation = "bit manipulation"
    greedy = "greedy"
    math_number = "Math's/number theory"


def validate_input(value) -> bool:
    is_valid = False
    try:
        _ = Status(value)
        return True
    except ValueError:
        is_valid = False
    try:
        _ = Difficulty(value)
        return True
    except ValueError:
        is_valid = False
    try:
        _ = Tags(value)
        return True
    except ValueError:
        is_valid = False

    return is_valid
