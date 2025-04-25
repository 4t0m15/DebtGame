#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_FILE_SIZE 1024

/* Function declarations */
int init_story();
void init_options();

/* Main function */
int main() {
    // init_story();
    // init_options();
    return 0;
}

/* Display the initial story text and ASCII art */
int init_story() {
    FILE *file;
    char buffer[MAX_FILE_SIZE];
    size_t bytes_read;

    file = fopen("text/example.txt", "r");
    if (file == NULL) {
        /* If file doesn't exist, hardcode the ASCII art */
        printf("You are in Debt of a Million dollars and you need to figure something out.\n");
        printf("GAME START!\n");
        return 0;
    }

    printf("You are in Debt of a Million dollars and you need to figure something out.\n");
    printf("GAME START!\n");
    
    /* Read and display file contents */
    bytes_read = fread(buffer, 1, MAX_FILE_SIZE - 1, file);
    buffer[bytes_read] = '\0';
    printf("%s\n", buffer);
    
    fclose(file);
    return 0;
}

/* Display and handle game mode options */
void init_options() {
    char choice[10];
    
    printf("Hello, you have 3 options\n");
    printf(" 1 - Gambler\n");
    printf(" 2 - Daytrader\n");
    printf(" 3 - Dealer\n");

    while (1) {
        printf("Enter your choice: ");
        fgets(choice, sizeof(choice), stdin);
        
        /* Remove newline if present */
        size_t len = strlen(choice);
        if (len > 0 && choice[len-1] == '\n') {
            choice[len-1] = '\0';
        }
        
        printf("You selected: %s\n", choice);
        
        /* Simple choice processing */
        if (strcmp(choice, "1") == 0) {
            printf("Gambler mode selected. This feature is not yet implemented.\n");
        } else if (strcmp(choice, "2") == 0) {
            printf("Daytrader mode selected. This feature is not yet implemented.\n");
        } else if (strcmp(choice, "3") == 0) {
            printf("Dealer mode selected. This feature is not yet implemented.\n");
        } else if (strcmp(choice, "exit") == 0 || strcmp(choice, "quit") == 0) {
            printf("Exiting game. Thanks for playing!\n");
            break;
        } else {
            printf("Invalid option. Please try again.\n");
        }
    }
    
    /* Commented out as in original code
    printf("Choose an option: (a)bout, (n)ew game, (h)elp: ");
    if (choice == 'a') {
        
    } else if (choice == 'n') {
    } else if (choice == 'h') {
    } else {
        printf("Invalid option.");
    }
    */
}