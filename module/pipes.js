export const imagePipe = {
    transform: (path) => `url('${path}')`
};

export const arrRandomizerPipe = {
    transform: (arr) => {
        let intermidiateArray = [];
        
        arr.forEach((el) => {
            intermidiateArray.push({
                randNum: Math.random(),
                element: el
            })
        });
    
        intermidiateArray.sort((elem1, elem2) => elem1.randNum - elem2.randNum);
    
        return intermidiateArray.map((elem) => elem.element);
    }
}
