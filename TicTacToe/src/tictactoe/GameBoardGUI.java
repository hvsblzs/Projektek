/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package tictactoe;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

/**
 *
 * @author havib
 */
public class GameBoardGUI {
    private JFrame frame;
    private JPanel boardPanel;
    private JLabel statusLabel;
    private GameBoard board;
    private String currentPlayer;
    private int size;

    /**
     * 
     * @param size gives the size of the gameBoard
     * Normal constructor, sets the basic parameters and values for the board.
     */
    public GameBoardGUI(int size) {
        this.size = size;
        board = new GameBoard(size);
        frame = new JFrame("Tic-Tac-Toe Variant");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        boardPanel = new JPanel(new GridLayout(size, size));
        statusLabel = new JLabel("Player X's turn");
        currentPlayer = "X";

        setupMenu();
        setupBoard();

        frame.add(boardPanel, BorderLayout.CENTER);
        frame.add(statusLabel, BorderLayout.SOUTH);
        frame.pack();
        frame.setVisible(true);
    }

    /**
     * Helper function, sets up the menu, and the options in it, sizes to choose from etc.
     */
    private void setupMenu() {
        JMenuBar menuBar = new JMenuBar();
        JMenu gameMenu = new JMenu("Game");

        JMenu newGameMenu = new JMenu("New Game");
        int [] boardSizes = new int[]{6, 10, 14};
        for(int boardSize : boardSizes){
            JMenuItem sizeMenuItem = new JMenuItem(boardSize + "X" + boardSize);
            newGameMenu.add(sizeMenuItem);
            sizeMenuItem.addActionListener(e -> startNewGame(boardSize));
        }
        
        JMenuItem exitGame = new JMenuItem("Exit");
        exitGame.addActionListener(e -> System.exit(0));

        gameMenu.add(newGameMenu);
        gameMenu.add(exitGame);

        menuBar.add(gameMenu);
        frame.setJMenuBar(menuBar);
    }

    private void setupBoard() {
        boardPanel.removeAll();
        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                JButton button = new JButton();
                button.setPreferredSize(new Dimension(80, 40));
                button.addActionListener(new ButtonListener(row, col));
                boardPanel.add(button);
            }
        }
    }

    private void refreshBoard() {
        for (int row = 0; row < size; row++) {
            for (int col = 0; col < size; col++) {
                JButton cell = (JButton) boardPanel.getComponent(row * size + col);
                Symbol piece = board.getPiece(row, col);
                cell.setText(piece == null ? "" : piece.getSymbol());
            }
        }
    }

    private void startNewGame(int newSize) {
        frame.dispose();
        new GameBoardGUI(newSize);
    }

    /**
     * 
     * @param row Row of placement
     * @param col Column of placement
     * Places the appropriate piece on the board given by the coordinates and 
     * checks whether it's a draw, win, or neither and the game moves on.
     */
    private void placePiece(int row, int col) {
        if (board.placePiece(row, col, currentPlayer)) {
            refreshBoard();
            if (board.checkWin(currentPlayer)) {
                JOptionPane.showMessageDialog(frame, "Player " + currentPlayer + " wins!", "Game Over", JOptionPane.PLAIN_MESSAGE);
            } else if (board.isDraw()) {
                JOptionPane.showMessageDialog(frame, "It's a draw!", "Game Over", JOptionPane.PLAIN_MESSAGE);
            } else {
                currentPlayer = currentPlayer.equals("X") ? "O" : "X";
                statusLabel.setText("Player " + currentPlayer + "'s turn");
            }
        }
    }

    class ButtonListener implements ActionListener {
        private int row, col;

        public ButtonListener(int row, int col) {
            this.row = row;
            this.col = col;
        }

        @Override
        public void actionPerformed(ActionEvent e) {
            placePiece(row, col);
        }
    }
}