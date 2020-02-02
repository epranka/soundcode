<h1 align="center" style="border-bottom: none;">𝄞 How does your code sound?</h1>

<h3 align="center">And the idea was born...</h3>

<br />

<h2 align="center">About the idea</h2>

As a developer, I love listening to music while coding. The orchestral music allows me to focus more on what I do. And one day I noticed my fingers dance on the keyboard by the music rhythm. Like playing the piano. Every word or symbol in the code was written with harmony. And then I thought... how it could sound... The code I write every day?

_And the idea was born._

<br />

> Put your code and enjoy how it sounds: [soundcode.now.sh](https://soundcode.now.sh/)

Have ideas on how to improve it? New features? Feel free to share it on the [GitHub Issues](https://github.com/epranka/soundcode/issues).

<br />

<h2>How it works</h2>

Firstly, we load the sound fonts of the instruments which are used in this little orchestra. When you paste or write your code (or using our example), we parse it using the TypeScript AST parser to individual nodes. Then the composition begins.

<h2>The mood of the code</h2>
By code source, we determine the mood of the code. The more cheerful words in the code, the happier the mood and vice versa. The mood of the code is used to set the musical scale. If happy, a Major will be likely selected, if sad - Minor.

<h2>Chords</h2>
By the code source and with some easy math we choose which chords progression play from the determined musical scale.

<h2>The Melody of the piano</h2>
Each piano note is the TypeScript Token. With some math, we set the note, pitch, duration and time when to play. The special symbols like ,.+-/* and etc are excluded and used in the other instrument

<h2>Other instruments</h2>
Each instrument has its own notes. Some just looping the notes of the chord, while others play specific notes by the source code. For example, the Cello always plays active chord root note, when Harp only plays at the special characters or Chorus at the strings.
