# Backend-task-3
This task creates a simple files API for hosting and storing files on a containerised PostSQL database. It supports operations for adding, deleting and retrieving binary files, including all of their data, stored as a binary stream.

# API Endpoints
1. POST /upload: Upload a file to the server.
2. GET /retrieve/:filename: Retrieve a file from the server.
3. DELETE /delete/:filename: Delete a file from the server.

# Usage
1. To upload a file-
    $filePath = "C:\Users\Ria\OneDrive\Desktop\test.txt"
>> $fileName = [System.IO.Path]::GetFileName($filePath)
>> $boundary = [System.Guid]::NewGuid().ToString()
>> $LF = "`r`n"
>> $bodyLines = (
>>     "--$boundary",
>>     "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
>>     "Content-Type: text/plain",
>>     "",
>>     [System.IO.File]::ReadAllText($filePath),
>>     "--$boundary--"
>>![image](https://github.com/ria110/backend-task-3/assets/139352519/1dfcdaff-ff3c-4386-9788-524fa318c0fa)

 2. To retrieve a file - 
PS C:\Users\Ria\OneDrive\Desktop\misc\backendtask3> $response = Invoke-RestMethod -Uri "http://localhost:8080/retrieve/test.txt" -Method Get
>> $response
>>
rawr
![image](https://github.com/ria110/backend-task-3/assets/139352519/02d50606-57ea-4243-9d62-c23ae95bb8bc)

3. To delete a file - 
PS C:\Users\Ria\OneDrive\Desktop\misc\backendtask3> $filePath = "C:\Users\Ria\OneDrive\Desktop\test.txt"
>> $fileName = [System.IO.Path]::GetFileName($filePath)
>> $boundary = [System.Guid]::NewGuid().ToString()
>> $LF = "`r`n"
>> $bodyLines = (
>>     "--$boundary",
>>     "Content-Disposition: form-data; name=`"file`"; filename=`"$fileName`"",
>>     "Content-Type: text/plain",
>>     "",
>>     [System.IO.File]::ReadAllText($filePath),
>>     "--$boundary--"
PS C:\Users\Ria\OneDrive\Desktop\misc\backendtask3> $fileName = "test.txt"  # Replace with the name of the file you want to delete      
>>
>> $response = Invoke-RestMethod -Uri "http://localhost:8080/delete/$fileName" -Method Delete
>> $response
>>

message
-------
Deleted 1 file
![image](https://github.com/ria110/backend-task-3/assets/139352519/08f5808f-3dad-48e8-8d87-e466a7b9ba39)

# Database Schema
The application uses a simple schema for storing files:

![image](https://github.com/ria110/backend-task-3/assets/139352519/a6915e75-fe94-40ea-9cef-a363870eb69e)

1. id: auto-incremented unique identifier for each file.
2. filename: name of the uploaded file.
3. content: byte array storing the content of the file.

