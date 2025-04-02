mod display_text;

fn main() {
    //println!("Hello, world!");
    //number_guesser();
    //display_text::display_text();
    display_text::init_story();
}
// fn number_guesser() {
//     println!("Guess a number between 1 and 10");
//     println!("Please input your guess.");
//     let mut answer = 3;
//     let mut guess = String::new();
//     std::io::stdin()
//         .read_line(&mut guess)
//         .expect("Failed to read line");
//     if guess.trim() == answer.to_string() {
//         println!("You guessed the right number!");
//     }/* elseif guess.trim >= 10 {
//         println!("Sorry, that's not the right number.");
//     }*/
// }