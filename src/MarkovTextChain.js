class MarkovTextChain{
    constructor(){
        this.punctuation = /([.,?!;:])/g;
        this.order = 1;
    }
    //  trim
    analyze(input, order){
        this.order = order;
        //  trim off ends then pad punctuation with white space (turn "cat." into "cat . ")
        //  Then convert string into an array and remove blank spaces - consider white space removal...
        let array = input.trim()
                         .replace(this.punctuation, " $1 ")
                         .split(" ").filter(item =>{
                            if(item !== "")
                                return item;
                         });

        //  Iterate over list and build chain.
        //  Start is a special case, it acts like a word after a fullstop.
        //  Each word, check next if available.

        // if(this.order === 2){
            this.chain = {};
            this.chain["."] = {};
            this.chain["."][array[0]] = 1;

            let currentWindow = [];

            for(let o = 0;o< this.order;o++){
                currentWindow.push(null);
            }

            // Work out how often a given word follows another word.
            for(let i=0;i<array.length-1;i++){
                currentWindow.shift();
                currentWindow.push(array[i]);

                if(!this.chain[currentWindow]){
                    this.chain[currentWindow] = {};
                    this.chain[currentWindow][array[i+1]] = 1;
                }
                else if(!this.chain[currentWindow][array[i+1]]){
                    this.chain[currentWindow][array[i+1]] = 1;
                }
                else{
                    this.chain[currentWindow][array[i+1]]++;
                }
            }
        // }

        // Calculate probabilities.
        // for each word, sum the counts and then divide each by the sum.
        for(let wordTuple in this.chain){
            if(this.chain.hasOwnProperty(wordTuple)){
                let sum = 0;

                // sum the total number of associated word values 
                for(let associatedWord in this.chain[wordTuple]){
                    if(this.chain[wordTuple].hasOwnProperty(associatedWord)){
                        sum += this.chain[wordTuple][associatedWord];
                    }
                }

                // Divide each associated word total by the sum and then add the previous value.
                // This is to get a range of probabilities like [0.25, 0.5, 0.8, 1]
                let previousWord = null;
                for(let associatedWord in this.chain[wordTuple]){
                    if(this.chain[wordTuple].hasOwnProperty(associatedWord)){
                        this.chain[wordTuple][associatedWord] /= sum;

                        if(previousWord != null){
                            this.chain[wordTuple][associatedWord] += this.chain[wordTuple][previousWord];
                        }
                    }

                    previousWord = associatedWord;
                }
            }
        }
        
        return this.chain;
    }

    generate(length){
        let currentWindow = this.pickStartingWords();
        let generatedText = [];
        
        currentWindow.forEach(w => generatedText.push(` ${w}`));

        for(let i=0;i<length;i++){
            let pickedWord = this.pickWord(currentWindow);

            // If word is not punctuation then insert a space before.
            if(this.punctuation.test(pickedWord)){
                generatedText.push(pickedWord);
            }else{
                generatedText.push(` ${pickedWord}`);
            }
            
            currentWindow.shift();
            currentWindow.push(pickedWord);
        }

        return generatedText.join("");
    }

    pickStartingWords(){
        let tuple = [];
        let startingWords = [];
        let startingWindow = [];

        for(let o = 0;o< this.order; o++){
            startingWindow.push(null);
        }

        for(let property in this.chain){
            if(this.chain.hasOwnProperty(property)){
                if(property.startsWith(".")){
                    if(!startingWords[property])
                        startingWords.push(property);
                }
            }
        }

        let randomIndex = Math.floor(Math.random() * startingWords.length);
        let startingTuple = startingWords[randomIndex].split(",");

        while(startingTuple[0] === "."){
            startingTuple.push(this.pickWord(startingTuple));
            startingTuple.shift();
        }
        return startingTuple;
    }

    pickWord(currentWindow){
        if(!this.chain[currentWindow]){
            return " ";
        }

        var random = Math.random();

        for(let word in this.chain[currentWindow]){
            if(random < this.chain[currentWindow][word]){
                return word;
            }
        }
    }
}


