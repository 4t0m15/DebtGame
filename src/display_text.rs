pub fn init_story() {
//     println!("                         
//                          
//          ♦               
//        ♦♦ ♦       ♦♦♦    
//       ♦    ♦    ♦♦   ♦♦  
//      ♦      ♦   ♦     ♦  
//    ♦♦     ♦♦   ♦  ♦ ♦  ♦ 
//   ♦      ♦     ♦       ♦ 
//  ♦      ♦♦     ♦ ♦   ♦ ♦ 
//   ♦♦  ♦♦ ♦      ♦ ♦♦♦ ♦  
//     ♦♦   ♦      ♦♦   ♦♦  
//          ♦♦       ♦♦♦    
//           ♦        ♦     
//           ♦        ♦     
//           ♦♦♦♦♦♦   ♦     
//                 ♦♦♦♦     
//                    ♦     
//                    ♦     
//                    ♦     
//                   ♦♦♦    
//                  ♦♦ ♦♦   
//                  ♦   ♦   
//                          ");
//     println!("'Hello, You are in Debt of a MILLION BUCKS!!!'");
//     println!(" - THE MOB");
    use std::fs;
    use std::io;
    pub fn init_story() -> io::Result<()> {
        let file_path = "text/example.txt";
        println!("In file {file_path}");
        let contents = fs::read_to_string(file_path);
        println!("With text:\n{contents}");
        Ok(())
    };
}