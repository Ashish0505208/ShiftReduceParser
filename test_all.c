#include <stdio.h>
#include <string.h>
#include <stdlib.h>

struct grammar {
    char lhs[10];     // Left-hand side of production
    char rhs[20];     // Right-hand side of production
} g[10];

int main() {
    int np, i, j, k, stpos = 0, r;

    printf("\nEnter Number of productions: ");
    scanf("%d", &np);

    // Read Productions
    printf("\nEnter productions:\n");
    for (i = 0; i < np; i++) {
        char temp[30];
        scanf("%s", temp);
        strncpy(g[i].lhs, temp, 1);
        g[i].lhs[1] = '\0';
        strcpy(g[i].rhs, &temp[3]);
    }

    char ip[50];
    printf("\nEnter Input: ");
    scanf("%s", ip);

    // Add `$` at the end of the input to denote the end
    strcat(ip, "$");

    int lip = strlen(ip);
    char stack[50][10];   // Stack with string entries

    // Initialize stack with `$`
    strcpy(stack[stpos++], "$");

    printf("\n+----------------------+----------------------+----------------------------+");
    printf("\n|       STACK          |     INPUT BUFFER     |          ACTION            |");
    printf("\n+----------------------+----------------------+----------------------------+");

    i = 0;

    // Parsing loop
    while (i < lip - 1 || stpos > 1) {   // Stop before final `$`
        if (ip[i] == '$') {  
            // Stop parsing on reaching `$`
            break;  
        }

        r = 1;

        // Detect and push `id` as a single terminal, all others as single char
        if (ip[i] == 'i' && ip[i + 1] == 'd') {
            strcpy(stack[stpos], "id");
            i += 2;  // Skip both characters
        } else {
            snprintf(stack[stpos], sizeof(stack[stpos]), "%c", ip[i]);
            i++;
        }
        stpos++;

        // Print current stack, input buffer, and action
        printf("\n| ");

        // Print stack content
        for (j = 0; j < stpos; j++) {
            printf("%s", stack[j]);
        }

        for (j = stpos; j < 10; j++) {
            printf(" ");
        }

        printf(" | ");

        // Print remaining input buffer
        for (j = i; j < lip; j++) {
            printf("%c", ip[j]);
        }

        for (j = i; j < 10; j++) {
            printf(" ");
        }

        // Print shift action
        printf("| Shift %s                  |", stack[stpos - 1]);

        // Reduction loop
        while (r != 0) {
            r = 0;

            for (k = 0; k < stpos; k++) {
                char ts[20] = "";
                int tspos = 0;

                // Extract portion of stack to match with RHS of production
                for (j = k; j < stpos; j++) {
                    strcat(ts, stack[j]);
                }

                // Check for matching production
                for (j = 0; j < np; j++) {
                    if (strcmp(ts, g[j].rhs) == 0) {
                        // Perform reduction
                        stpos = k;
                        strcpy(stack[stpos], g[j].lhs);
                        stpos++;

                        // Print the reduction action
                        printf("\n| ");

                        for (int p = 0; p < stpos; p++) {
                            printf("%s", stack[p]);
                        }

                        for (int p = stpos; p < 10; p++) {
                            printf(" ");
                        }

                        printf(" | ");

                        for (int p = i; p < lip; p++) {
                            printf("%c", ip[p]);
                        }

                        for (int p = i; p < 10; p++) {
                            printf(" ");
                        }

                        printf("| Reduce %s -> %s         |", g[j].rhs, g[j].lhs);
                        r = 1;
                        break;
                    }
                }
            }
        }
    }

    printf("\n+----------------------+----------------------+----------------------------+");

    // Final acceptance check: Compare stack[1] with g[0].lhs
    if (stpos == 2 && strcmp(stack[0], "$") == 0 && strcmp(stack[1], g[0].lhs) == 0) {
        printf("\nString Accepted\n");
    } else {
        printf("\nString Rejected\n");
    }

    return 0;
}
