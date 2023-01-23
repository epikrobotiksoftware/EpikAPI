# Set up a signal handler to terminate the background processes
trap "kill 0" SIGINT

mongod &

roscore &

sleep 2

roslaunch rosbridge_server rosbridge_websocket.launch &

roslaunch mir_navigation start_mapping.launch &


rosrun robot publish_robot_state.py &


# Wait for any background process to terminate
wait
