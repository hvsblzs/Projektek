/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tictactoe;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
/**
 *
 * @author havib
 */
public class GameBoard {
    private Symbol[][] board;
    private int size;
    private Random random;

    public GameBoard(int size) {
        this.size = size;
        board = new Symbol[size][size];
        random = new Random();
    }

    /**
     * 
     * @param row Row
     * @param col Col
     * @param symbol Symbol
     * @return True or false, whether it is possible to place down a symbol on 
     * the given coordinates.
     */
    public boolean placePiece(int row, int col, String symbol) {
        if (board[row][col] == null) {
            board[row][col] = new Symbol(symbol);
            checkRemoval(symbol);
            return true;
        }
        return false;
    }

    /**
     * 
     * @param symbol Symbol
     * Checks if there's a need to remove symbols from the board.
     */
    private void checkRemoval(String symbol) {
        int count = checkForConsecutive(symbol);
        if (count == 3) removePieces(symbol, 1);
        else if (count == 4) removePieces(symbol, 2);
    }

    /**
     * 
     * @param symbol Symbol
     * @return Number of consecutive symbols.
     * Checks the entire board, looking for the maximum number of consecutive symbols.
     */
    private int checkForConsecutive(String symbol) {
        int maxCount = 0;
        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                if (board[row][col] != null && board[row][col].getSymbol().equals(symbol)) {
                    maxCount = Math.max(maxCount, maxConsecutive(row, col, symbol));
                }
            }
        }
        return maxCount;
    }

    /**
     * 
     * @param row Row
     * @param col Col
     * @param symbol Symbol
     * @return Max number of consecutive symbols, starting from a given index.
     */
    private int maxConsecutive(int row, int col, String symbol) {
        int max = 0;
        max = Math.max(max, countInDirection(row, col, symbol, 1, 0));
        max = Math.max(max, countInDirection(row, col, symbol, 0, 1));
        max = Math.max(max, countInDirection(row, col, symbol, 1, 1));
        max = Math.max(max, countInDirection(row, col, symbol, 1, -1));
        return max;
    }

    /**
     * 
     * @param row Row
     * @param col Col
     * @param symbol symbol
     * @param dRow directionRow
     * @param dCol directionCol
     * @return Returns the consecutive pieces in the given direction.
     * Helper function that counts consecutive symbols in a specific direction 
     * (horizontal, vertical, etc.)
     */
    private int countInDirection(int row, int col, String symbol, int dRow, int dCol) {
        int count = 0;
        for (int i = 0; i < 5; i++) {
            int newRow = row + i * dRow;
            int newCol = col + i * dCol;
            if (newRow < 0 || newRow >= size || newCol < 0 || newCol >= size) break;
            if (board[newRow][newCol] != null && board[newRow][newCol].getSymbol().equals(symbol)) count++;
            else break;
        }
        return count;
    }

    /**
     * 
     * @param symbol Symbol
     * @param count count
     * Removes a random symbol from the board, count times.
     */
    private void removePieces(String symbol, int count) {
        List<int[]> pieces = new ArrayList<>();
        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                if (board[row][col] != null && board[row][col].getSymbol().equals(symbol)) {
                    pieces.add(new int[]{row, col});
                }
            }
        }
        for (int i = 0; i < count && !pieces.isEmpty(); i++) {
            int[] pos = pieces.remove(random.nextInt(pieces.size()));
            board[pos[0]][pos[1]] = null;
        }
    }

    /**
     * 
     * @param symbol Symbol
     * @return True or false, whether the game is won by anyone, aka 5 
     * consecutive symbols has been  reached in any direction.
     */
    public boolean checkWin(String symbol) {
        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                if (maxConsecutive(row, col, symbol) >= 5) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 
     * @return True or false, whether the game is a draw or not. It is a draw 
     * if the board is full, but no one has won yet. 
     */
    public boolean isDraw() {
        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                if (board[row][col] == null) return false;
            }
        }
        return true;
    }

    public Symbol getPiece(int row, int col) {
        return board[row][col];
    }

    public int getSize() {
        return size;
    }

    public void resetBoard() {
        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                board[row][col] = null;
            }
        }
    }
}