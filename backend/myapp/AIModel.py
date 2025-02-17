from google import genai
import time
from datetime import datetime
import json  # Import the json library


staticPromptPart = '''
1. **Task Creation**:
   - Generate tasks ONLY when explicitly requested by the user.
   - Include both requested tasks and additional relevant suggestions.
   - Always maintain this JavaScript object structure only:
{
    "response": Final,
    'data': {
        "title": "Task title",
        "date": "8/25/2024, 10:33:25 PM",
        "data": {
            "0": {
                "num": "1 -",
                "added_date": "I will give you time stamp put it here",
                "complete_date": "Not completed",
                "status": "false",
                "content": "First task content"
            },
            "1": {
                "num": "2 -",
                "added_date": "I will give you time stamp put it here",
                "complete_date": "Not completed",
                "status": "false",
                "content": "Second task content"
            },
            "2": {
                "num": "3 -",
                "added_date": "I will give you time stamp put it here",
                "complete_date": "Not completed",
                "status": "false",
                "content": "Third task content"
            },
            "3": {
                "num": "4 -",
                "added_date": "I will give you time stamp put it here",
                "complete_date": "Not completed",
                "status": "false",
                "content": "Fourth task content"
            }
            ....
        }
    }
}
but if you want to ask user some question to giv more accurate answer, maintain this JavaScript object structure only:
{
    "response": Not Final,
    "data": {
        "0": "your question"
        "1": "your question"
        "2": "your question"
        ...
    }
}
2. **Requirements**:
   - Use double quotes for all property names and string values
   - Ensure valid JavaScript object syntax (commas, brackets)
   - Generate realistic timestamps in chronological order
   - Include at least 4 tasks by default, add more for complex requests
   - Add your own relevant tasks if user requests are vague

3. **Output**:
   - Only return JavaScript object
   - No explanations, markdown, or extra text

Example request: "Create a study plan for Python"
'''

client = genai.Client(api_key="AIzaSyDbqi5rmcLnug7pWzOLJS-t6CIMEBW-6IU")

timestamp = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")

def prompt(userPrompt):
    userMessage = f'''
    Time_stamp = {timestamp}
    {staticPromptPart}
    user prompt: {userPrompt}
    '''
    # user prompt: giv me plane to travel for Germany.
    print("User userMessage:", userMessage)
    response = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=userMessage,
    )
    # print("#####################################################")
    # print("API Response:", response.text)
    # javascript_object = json.loads(response.text)
    return response.text

# prompt("test")
