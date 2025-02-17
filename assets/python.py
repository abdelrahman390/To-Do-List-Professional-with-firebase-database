# from google import genai
# import time
# from datetime import datetime
# # Static prompt part with proper JSON formatting
# staticPromptPart = '''
# 1. **Task Creation**:
#    - Generate tasks ONLY when explicitly requested by the user.
#    - Include both requested tasks and additional relevant suggestions.
#    - Always maintain this JavaScript object structure:
# {
#     "title": "Task title",
#     "date": "8/25/2024, 10:33:25 PM",
#     "data": {
#         "0": {
#             "num": "1 -",
#             "added_date": "I will give you time stamp put it here",
#             "complete_date": "Not completed",
#             "status": "false",
#             "content": "First task content"
#         },
#         "1": {
#             "num": "2 -",
#             "added_date": "I will give you time stamp put it here",
#             "complete_date": "Not completed",
#             "status": "false",
#             "content": "Second task content"
#         },
#         "2": {
#             "num": "3 -",
#             "added_date": "I will give you time stamp put it here",
#             "complete_date": "Not completed",
#             "status": "false",
#             "content": "Third task content"
#         },
#         "3": {
#             "num": "4 -",
#             "added_date": "I will give you time stamp put it here",
#             "complete_date": "Not completed",
#             "status": "false",
#             "content": "Fourth task content"
#         }
#         ....
#     }
# }
# 2. **Requirements**:
#    - Use double quotes for all property names and string values
#    - Ensure valid JavaScript object syntax (commas, brackets)
#    - Generate realistic timestamps in chronological order
#    - Include at least 4 tasks by default, add more for complex requests
#    - Add your own relevant tasks if user requests are vague

# 3. **Output**:
#    - Only return the raw JavaScript object
#    - No explanations, markdown, or extra text
#    - Ensure immediate usability in HTML DOM:
#      document.getElementById("tasks").innerHTML = yourResponse;

# Example request: "Create a study plan for Python"
# '''

# # Initialize the client
# client = genai.Client(api_key="AIzaSyDbqi5rmcLnug7pWzOLJS-t6CIMEBW-6IU")

# def prompt(userMessage):
#     print("User prompt:", userMessage)
#     response = client.models.generate_content(
#         model="gemini-2.0-flash",
#         contents=userMessage,
#     )
#     print("#####################################################")
#     print("API Response:", response.text)

# # Generate a timestamp
# timestamp = datetime.now().strftime("%m/%d/%Y, %I:%M:%S %p")

# # Format the user message
# userMessage = f'''
# Time_stamp = {timestamp}
# {staticPromptPart}
# User prompt: Can you make a plan for me to study data structures in 3 months?
# '''

# # Call the prompt function
# prompt(userMessage)