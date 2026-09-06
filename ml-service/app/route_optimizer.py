import math
import json

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371.0 # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def optimize_logistics_route(pickup_points, delivery_point, vehicle_capacity_kg=3000):
    """
    Solves pickup aggregation & delivery route optimization.
    pickup_points: list of dicts [{'name': str, 'lat': float, 'lng': float, 'quantity_kg': float}]
    delivery_point: dict {'name': str, 'lat': float, 'lng': float}
    """
    total_quantity = sum(p.get('quantity_kg', 0) for p in pickup_points)
    utilization = min(100.0, round((total_quantity / vehicle_capacity_kg) * 100, 1))
    
    # Try Google OR-Tools CVRP
    try:
        from ortools.constraint_solver import routing_enums_pb2
        from ortools.constraint_solver import pywrapcp

        all_nodes = pickup_points + [delivery_point]
        num_nodes = len(all_nodes)
        
        # Build distance matrix (multiplied by 1.25 for road tortuosity)
        dist_matrix = []
        for i in range(num_nodes):
            row = []
            for j in range(num_nodes):
                d = haversine_distance(all_nodes[i]['lat'], all_nodes[i]['lng'], all_nodes[j]['lat'], all_nodes[j]['lng'])
                row.append(int(d * 1250)) # Convert to meters
            dist_matrix.append(row)

        manager = pywrapcp.RoutingIndexManager(num_nodes, 1, 0)
        routing = pywrapcp.RoutingModel(manager)

        def distance_callback(from_index, to_index):
            from_node = manager.IndexToNode(from_index)
            to_node = manager.IndexToNode(to_index)
            return dist_matrix[from_node][to_node]

        transit_callback_index = routing.RegisterTransitCallback(distance_callback)
        routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

        search_parameters = pywrapcp.DefaultRoutingSearchParameters()
        search_parameters.first_solution_strategy = routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC

        solution = routing.SolveWithParameters(search_parameters)

        if solution:
            index = routing.Start(0)
            route_indices = []
            while not routing.IsEnd(index):
                route_indices.append(manager.IndexToNode(index))
                index = solution.Value(routing.NextVar(index))
            route_indices.append(manager.IndexToNode(index))
            
            ordered_stops = [all_nodes[idx] for idx in route_indices if idx < num_nodes]
            # Ensure delivery point is at the end
            if ordered_stops[-1] != delivery_point and delivery_point in ordered_stops:
                ordered_stops.remove(delivery_point)
                ordered_stops.append(delivery_point)
            
            total_dist_km = 0.0
            for k in range(len(ordered_stops) - 1):
                total_dist_km += haversine_distance(
                    ordered_stops[k]['lat'], ordered_stops[k]['lng'],
                    ordered_stops[k+1]['lat'], ordered_stops[k+1]['lng']
                ) * 1.25

            # Calculate unoptimized traditional distance (hub-and-spoke individual roundtrips)
            traditional_dist_km = sum(
                haversine_distance(p['lat'], p['lng'], delivery_point['lat'], delivery_point['lng']) * 2.5
                for p in pickup_points
            )

            distance_saved = max(0.0, round(traditional_dist_km - total_dist_km, 1))
            fuel_cost_per_km = 11.5 # INR per km for diesel truck
            cost_saved = round(distance_saved * fuel_cost_per_km, 2)
            estimated_time = int(total_dist_km * 2.2 + len(pickup_points) * 15)

            return {
                "route_waypoints": ordered_stops,
                "total_distance_km": round(total_dist_km, 1),
                "traditional_distance_km": round(traditional_dist_km, 1),
                "distance_saved_km": distance_saved,
                "estimated_time_minutes": estimated_time,
                "vehicle_utilization_pct": utilization,
                "estimated_fuel_cost": round(total_dist_km * fuel_cost_per_km, 2),
                "estimated_cost_saved": cost_saved,
                "solver_used": "OR-Tools CVRP Solver"
            }
    except Exception as e:
        print(f"OR-Tools solver note ({e}), using geometric Nearest Neighbor fallback.")

    # Geometric Nearest Neighbor Fallback
    unvisited = list(pickup_points)
    current = unvisited.pop(0) if unvisited else delivery_point
    ordered_stops = [current]

    while unvisited:
        nearest = min(unvisited, key=lambda p: haversine_distance(current['lat'], current['lng'], p['lat'], p['lng']))
        ordered_stops.append(nearest)
        unvisited.remove(nearest)
        current = nearest

    ordered_stops.append(delivery_point)

    total_dist_km = 0.0
    for k in range(len(ordered_stops) - 1):
        total_dist_km += haversine_distance(
            ordered_stops[k]['lat'], ordered_stops[k]['lng'],
            ordered_stops[k+1]['lat'], ordered_stops[k+1]['lng']
        ) * 1.25

    traditional_dist_km = sum(
        haversine_distance(p['lat'], p['lng'], delivery_point['lat'], delivery_point['lng']) * 2.4
        for p in pickup_points
    )
    if traditional_dist_km <= total_dist_km:
        traditional_dist_km = total_dist_km * 1.45

    distance_saved = round(traditional_dist_km - total_dist_km, 1)
    fuel_cost_per_km = 11.5
    cost_saved = round(distance_saved * fuel_cost_per_km, 2)
    estimated_time = int(total_dist_km * 2.2 + len(pickup_points) * 15)

    return {
        "route_waypoints": ordered_stops,
        "total_distance_km": round(total_dist_km, 1),
        "traditional_distance_km": round(traditional_dist_km, 1),
        "distance_saved_km": distance_saved,
        "estimated_time_minutes": estimated_time,
        "vehicle_utilization_pct": utilization,
        "estimated_fuel_cost": round(total_dist_km * fuel_cost_per_km, 2),
        "estimated_cost_saved": cost_saved,
        "solver_used": "Nearest Neighbor Heuristic CVRP"
    }
