use std::fs;
use std::io;
use std::io::prelude::*;
use colored::*;
pub fn init_story() -> io::Result<()> {
    let file_path = "text/example.txt";
    let contents = fs::read_to_string(file_path)?; //contents would be a result enum (Result<String>) using ? to contents.unwrap()
    println!("You are in Debt of a Million dollars and you need to figure something out.");
    println!("GAME START!\n{}", contents.truecolor(39, 128, 34));//the {} is super cool why isnt this in other languages?
    Ok(())
}
pub fn init_options() {
    // I love having one really long print statement with \n's
    //TODO add help option and a menu with about and start game options
    println!("Hello, you have 3 options \n 1 - Gambler \n 2 - Daytrader \n 3 - Dealer");

    let mut stdin = io::stdin();
    let choice = &mut String::new();

    loop {
        choice.clear();
        stdin.read_line(choice);
        println!("{}", choice);
    }
/*    println!("Choose an option: (a)bout, (n)ew game, (h)elp: ");
    if (choice == 'a') {
        //printAbout();
    } else if (choice == 'n') {
        //starrsutNewGame(input);
    } else if (choice == 'h') {
    } else {
        System.out.println("Invalid option. Please choose again.");
    }*/
}