use std::fs;
use std::io;
pub fn init_story() -> io::Result<()> {
    let file_path = "text/example.txt";
    let contents = fs::read_to_string(file_path)?; //contents would be a result enum (Result<String>) using ? to contents.unwrap()
    println!("GAME START!\n{}", contents);
    Ok(())
}