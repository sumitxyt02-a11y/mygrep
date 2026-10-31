## Step 1: Problem Understanding

## A. What is the Problem
User provides a file with specific words to find inside it and print
all the matched lines

## B. What is the Input ?
grep "learning" notes.txt

## C. What will be expecter Output ?
I am learning JavaScript
I am learning grep

Only matching lines are printed.

## D. What to support for now ?
Command	                        What it does
grep "error" app.log	        Finds lines containing error
grep -i "error" app.log	        Ignores uppercase/lowercase differences
grep -n "error" app.log	        Shows matching lines with line numbers

## E. How to know success
if the input is this grep "error" app.log then output should be
I am learning JavaScript
I am learning grep


## Step 2: Problem Decomposition

### Step 1: Identify the gap of Input and Output

Input 
grep "learning" notes.txt

Output
I am learning JavaScript
I am learning grep

- read the file
- 

### Step 1: Input main kya - kya information hai ?
- command (grep) and arguments (string, file) ("learning", notes.txt)
- string tell what to find for
- file tells where to find 

Actions
- grep command for start searching
- given what to search for "learning" and where to search notes.txt
- read the file line one by one 
- find the line where "learning" exits
- print the line

### Step 2: Input ko output mein badalne ke liye kya samajhna padega ?
- `grep` command to start for searching
- `arguments (string, file)` string what to search for, file where to search

### Step 3: Kya transformation karna padega ?
- find the give pattern in the file and and return matched line

### Step 4: Kaun se cases handle karna padega
- empty inputs
- extra spaces


## Step 3: Ab actions se components banao

Discovered actions                      Possible components
grep command for start searching            Parser
given what to search for 
"learning" and where to search notes.txt

read the file line one by one 
find the line where "learning" exits        read file

print the line                              build output



## Step 3: Solution Desing

### Step 1: Component ke naam dekhkar algorithm mat banao


# Step 1: Problem Understanding

## A. What is the Problem
when user enter this command grep -r "hello" src/ search for the text in folder and its subfolder and print it

## B. What is the Input ?
grep -r "hello" src/

## C. What will be expecter Output ?
src/app.js:console.log("hello world");
src/utils/helper.js:  return "hello";

## D. What to support for now ?
grep -r "hello" src/

## E. How to know success
user enter folder and find text and print text inside the subfolder

# Step 2: Problem Decomposition

## Input aur Output ke beach ka gap
- if option is -r then search folder inside subfolder
- pattern what to search inside folder
- the folder where to search
- find text inside folder and its subfolder
- print the line and its folder path

## Make components from action

Discovered actions                          Possible components
if option is -r then search folder          argument extract
inside subfolder

find text inside folder and its             text finder
subfolder

print the line and its folder path          output builder

## How does the components interact 

1. argument extract
extract all the arguments of the command 

2. text finder
understand what type of command this is and run the function
to find text inside folder and subfolder

3. output builder
prints the find result and its folder path where find


## Solution Design

### Component ka naan dekhkar algorithm mat banao

Input
grep -r "hello" src/

Output
src/app.js:console.log("hello world");
src/utils/helper.js:  return "hello";

- print lines with mathcing pattern
- path of file where get matching text
- folder and subfolder find matching text 
- when command is give -r with pattern and folder

### Har observation ko ek question mein badlo
- program ne un lines ko kaise dundha jaha pattern match hua
- program ko kaise pata chala ki vo is folder ki is file me ha
- kaise ek folder ke subfolder files ko read kiya 
- how program know this command for finding match in subfolder

### Tumhare questions ko investigate karo

start with first questions
program ne un lines ko kaise dundha jaha pattern match hua

input, grep -r "hello" src/

is input me aise kya hai jiske basis par program folder aur
uske subfolder ki file me pattern match kiya aur vo line
identify ki jisme pattern tha

Question ko operation mein badlein

#### Question se shuru karo

Question
program ne un lines ko kaise dundha jaha pattern match hua

Is question ka jawab dene ke liye program ko kya maloom hona chahiye
- use pattern pata hona chahiye jo ki file me dhundhna hai

Input ki information se file ke andar text identify karna hai

2. Required information identify karo

"Agar mujhe us line ko dhundhna ha jaha pattern match hau 
to input main konsi information dekhta"

Input                       Line
grep -r "hello" src/        "hello"


3. Information se possible action nikalo
action: break the file data into lines
compare the each line with the pattern give by user
if the line matches store this into array of object
and after all line match found
print each line

4. Verify karo ki action sahi hai ya nahi
apne proposed action ko alag input pat text karo

- grep -r "hello" src/
- grep -r "hello world" src/


QUESTION 2: 

1. Question se shuru karo
folder and subfolder find matching text 

is question ka jawab dene ke liye program ko kya 
maloom karna chahiye

currently in which folder's subfolder file you are reading

Input ki information se folder ke subfolders ki file read karna hai
aur find matching text 

2. Required information identify karo

agar mujhe folder's ki subfolder ke file ko read karna hai to me 
input meain konsi information dekhta 

Input                           folder
grep -r "hello" src/            src

3. Information se possible action nikalo
- get the folder from the command and patter
- loop through the folder 
- inside the folde loop run another loop inside the subfolder
- read the files of subfolder
- break file into lines and match the pattern
- if pattern match store it into object with the path
- and push the object into the array

4. Verfiy karo ki action sahi hai ya nahi
apne proposed action ko alag inputs pat text karo

