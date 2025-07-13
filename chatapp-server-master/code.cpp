#include <iostream>
#include <vector>
using namespace std;

void optimalPath(int N, int M, int price, int *source, int *dest, int *weight) {
    // Build adjacency list (assuming undirected graph)
    vector<vector<pair<int, int>>> adj(N + 1);
    for (int i = 0; i < M; ++i) {
        adj[source[i]].push_back({dest[i], weight[i]});
        adj[dest[i]].push_back({source[i], weight[i]});
    }

    vector<int> route;
    int current = 1; // Always start from landmark 1
    int spent = 0;
    route.push_back(current);

    // Move forward as long as possible
    while (true) {
        bool found = false;
        for (auto& next : adj[current]) {
            int nextLandmark = next.first;
            int cost = next.second;
            // Only go to next if it is not already visited (forward path)
            if (route.size() < N && (route.size() == 1 || nextLandmark == route.back() + 1)) {
                if (spent + cost <= price) {
                    spent += cost;
                    route.push_back(nextLandmark);
                    current = nextLandmark;
                    found = true;
                    break;
                }
            }
        }
        if (!found) break;
    }

    // Now, return back the same way (reverse the route except the last one)
    for (int i = route.size() - 2; i >= 0; --i) {
        route.push_back(route[i]);
    }

    // Output the route
    for (size_t i = 0; i < route.size(); ++i) {
        cout << route[i];
        if (i != route.size() - 1) cout << " ";
    }
    cout << endl;
}

int main() {
    int N, M, price;
    cin >> N >> M;
    cin >> price;
    int source[M], dest[M], weight[M];
    for (int i = 0; i < M; ++i) {
        cin >> source[i] >> dest[i] >> weight[i];
    }
    optimalPath(N, M, price, source, dest, weight);
    return 0;
}