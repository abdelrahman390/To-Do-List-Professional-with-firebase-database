from django.shortcuts import render, HttpResponse
# from django.http import JsonResponse
# from rest_framework.views import APIView 
# from .AIModel import prompt
# import json  # Import the json library
# # Create your views here.

# class AI(APIView):
#     def get(self, request):
#         userPrompt = request.GET.get('prompt')
#         result = prompt(userPrompt)
#         # python_dict = json.loads(result)
#         return HttpResponse(result) 

from django.http import JsonResponse  # Use JsonResponse for cleaner JSON returns
from rest_framework.views import APIView
from .AIModel import prompt
import json

import json
import re

def validate(userPrompt):
    try:
        # 1. Get the raw LLM response (replace with your actual LLM call)
        # llm_response = # ... your LLM interaction code ...

        # 2. Extract JSON using regular expression (handles variations)
        match = re.search(r"```json\n(.*)\n```", userPrompt, re.DOTALL)  # Improved regex
        print("match", match)
        if match:
            json_string = match.group(1).strip() # Remove leading/trailing spaces
        else:
            json_string = userPrompt.strip()  # Assume the whole response is JSON, remove spaces

        # 3. Parse JSON to validate (and raise exception if invalid)
        json.loads(json_string)  # Will raise JSONDecodeError if invalid

        # 4. Return the *cleaned* JSON string
        return json_string

    except (json.JSONDecodeError, TypeError) as e:
        print(f"Error processing LLM response: {e}")
        return "{}"  # Return empty JSON object on error

    except Exception as e: # Catch any other error
        print(f"Unexpected error in prompt function: {e}")
        return "{}"  # Return empty JSON object on error

class AI(APIView):
    def get(self, request):
        userPrompt = request.GET.get('prompt')
        result = prompt(userPrompt)

        # print("Raw LLM Response:", result) 
        test = validate(result)
        print("response", test) 
        try:
            # python_dict = json.loads(result) # Parse the string to dict
            return HttpResponse(test)  # Key: JsonResponse handles JSON conversion

        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            print("Raw response text:", result)
            return JsonResponse({"error": "Invalid JSON from LLM"}, status=500)

        except TypeError as e:
            print(f"Type Error: {e}")
            print("LLM Response:", result)
            return JsonResponse({"error": "Unexpected response type from LLM"}, status=500)