from fastapi import FastAPI, WebSocket, WebSocketDisconnect
app = FastAPI()

from typing import Optional
from pydantic import BaseModel
from typing import List
from fastapi.responses import HTMLResponse
from sqlalchemy import false, true

from fastapi.middleware.cors import CORSMiddleware

origins = [
    "http://localhost:9000",
]




html = """
<!DOCTYPE html>
<html>
    <head>
        <title>Chat</title>
    </head>
    <body>
        <h1>WebSocket Chat</h1>
        <h2>Your ID: <span id="ws-id"></span></h2>
        <form action="" onsubmit="sendMessage(event)">
            <input type="text" id="messageText" autocomplete="off"/>
            <button>Send</button>
        </form>
        <ul id='messages'>
        </ul>
        <script>
            var client_id = Date.now()
            document.querySelector("#ws-id").textContent = client_id;
            var ws = new WebSocket(`ws://localhost:8000/ws/${client_id}`);
            ws.onmessage = function(event) {
                var messages = document.getElementById('messages')
                var message = document.createElement('li')
                var content = document.createTextNode(event.data)
                message.appendChild(content)
                messages.appendChild(message)
            };
            function sendMessage(event) {
                var input = document.getElementById("messageText")
                ws.send(input.value)
                input.value = ''
                event.preventDefault()
            }
        </script>
    </body>
</html>
"""



app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class BatterySimulator:
    """A simple battery simulator class."""
    def __init__(self, name):
        """Initialize the battery simulator with 100.0 State of Charge (SOC)."""
        self.soc = 100.0
        self.charging = False
        self.name = name
    def get(self):
        """Get the current SOC of the battery simulator."""
        tmp = self.soc
        if self.charging:
            self.soc = tmp + 1 if tmp < 100.0 else 100.0
        else:
            self.soc = tmp - 1 if tmp > 0.0 else 0.0
        return {"isCharging": self.charging, "currentState": tmp}
    def charge(self, state):
        """Set the simulators charge state.
        Args:
        - state (bool): Desired charging state.
        """
        self.charging = state


robotX = BatterySimulator("robot-x")
robotY = BatterySimulator("robot-y")
robotZ = BatterySimulator("robot-z")

robotDic = {
    "robot-x": robotX,
    "robot-y": robotY,
    "robot-z": robotZ
}


class Charge(BaseModel):
    charging: bool
    name: str



@app.get("/")
async def get():
    return HTMLResponse(html)

@app.get("/get_host_name/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}

@app.get("/getRobotInfo/{identity}")
def get_robot_info(identity: str):
    return robotDic[identity]

@app.get("/getRobotStatus/{identity}")
def get_robot_status(identity: str):
    resp = robotDic[identity].get()
    return resp

@app.post("/charge")
def change_charging_state(charge: Charge):
    selectedRobot = robotDic[charge.name]
    if(selectedRobot):
       selectedRobot.charge(charge.charging)
        

    
    return {"charching": charge.charging}

@app.websocket("/ws/{robot_id}")
async def websocket_endpoint(websocket: WebSocket, robot_id: str):
    if(robotDic[robot_id]):
        await manager.connect(websocket)
        try:
            while True:
                data = await websocket.receive_text();
                await manager.send_personal_message({"charging": True, "currentStatus": 50}, websocket)
        except WebSocketDisconnect:
            manager.disconnect(websocket)
            await manager.broadcast(f"Client #{robot_id} left the chat")
           
    else:
        await websocket.close()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def send_personal_message(self, message, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            """await connection.send_text(message)"""


manager = ConnectionManager()