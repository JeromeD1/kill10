import { useState, useEffect } from "react"
import axios from "axios"
import "./Home.scss"
import { colorValues } from "../assets/variables/colorValues"

export default function Home() {
  const [gridKill10, setGridKill10] = useState([])
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [valuesFallen, setValuesFallen] = useState([])
  const [pass100, setPass100] = useState(false)
  const [pass200, setPass200] = useState(false)
  const [pass300, setPass300] = useState(false)

  const createGrid = () => {
    const newgrid = []
    for (let x = 1; x < 5; x++) {
      for (let y = 1; y < 5; y++) {
        const cell = {
          x,
          y,
          value: 0,
          mergeable: true,
        }
        newgrid.push(cell)
      }
    }

    setGridKill10(newgrid)

    return newgrid
  }

  const findFreeRandomPosition = (grid) => {
    const freePositions = grid.filter((cell) => cell.value === 0)

    const randomX = Math.floor(Math.random() * 5)
    const randomY = Math.floor(Math.random() * 5)

    if (
      freePositions.find((cell) => cell.x === randomX && cell.y === randomY)
    ) {
      return { randomX, randomY }
    } else {
      return findFreeRandomPosition(grid)
    }
  }

  const handleRandomNewNumber = () => {
    let returnNumber

    if (score < 100) {
      returnNumber = Math.random() < 0.33 ? 3 : Math.random() > 0.66 ? 5 : 7
    } else if (score < 200) {
      returnNumber =
        Math.random() < 0.2
          ? 2
          : Math.random() < 0.4
          ? 3
          : Math.random() < 0.6
          ? 5
          : Math.random() < 0.8
          ? 8
          : 7
    } else if (score < 300) {
      returnNumber =
        Math.random() < 0.142
          ? 1
          : Math.random() < 0.284
          ? 2
          : Math.random() < 0.426
          ? 3
          : Math.random() < 0.568
          ? 7
          : Math.random() < 0.71
          ? 8
          : Math.random() < 0.852
          ? 9
          : 5
    } else {
      returnNumber =
        Math.random() < 0.111
          ? 1
          : Math.random() < 0.222
          ? 2
          : Math.random() < 0.333
          ? 3
          : Math.random() < 0.444
          ? 4
          : Math.random() < 0.555
          ? 6
          : Math.random() < 0.666
          ? 7
          : Math.random() < 0.777
          ? 8
          : Math.random() < 0.888
          ? 9
          : 5
    }

    if (valuesFallen.length < 5) {
      const newValuesFallen = [...valuesFallen, returnNumber]
      setValuesFallen(newValuesFallen)
      return returnNumber
    } else {
      const nbValue = valuesFallen.filter(
        (value) => value === returnNumber
      ).length
      const proportion = nbValue / valuesFallen.length

      if (score < 100) {
        if (proportion > 0.35) {
          return handleRandomNewNumber()
        } else {
          const newValuesFallen = [...valuesFallen, returnNumber]
          setValuesFallen(newValuesFallen)

          return returnNumber
        }
      } else if (score < 200) {
        if (proportion > 0.23) {
          return handleRandomNewNumber()
        } else {
          const newValuesFallen = [...valuesFallen, returnNumber]
          setValuesFallen(newValuesFallen)

          return returnNumber
        }
      } else if (score < 300) {
        if (proportion > 0.155) {
          return handleRandomNewNumber()
        } else {
          const newValuesFallen = [...valuesFallen, returnNumber]
          setValuesFallen(newValuesFallen)

          return returnNumber
        }
      } else {
        if (proportion > 0.12) {
          return handleRandomNewNumber()
        } else {
          const newValuesFallen = [...valuesFallen, returnNumber]
          setValuesFallen(newValuesFallen)

          return returnNumber
        }
      }
    }
  }

  const handleDeleteLineAndSquare = (myGrid) => {
    let newGrid = myGrid

    // vérification des lignes
    for (let x = 1; x < 5; x++) {
      const cell1 = myGrid.find((cell) => cell.x === x && cell.y === 1)
      const cell2 = myGrid.find((cell) => cell.x === x && cell.y === 2)
      const cell3 = myGrid.find((cell) => cell.x === x && cell.y === 3)
      const cell4 = myGrid.find((cell) => cell.x === x && cell.y === 4)

      if (
        cell1.value !== 0 &&
        cell1.value === cell2.value &&
        cell1.value === cell3.value &&
        cell1.value === cell4.value
      ) {
        setScore((prevstate) => prevstate + 4 * cell1.value)

        newGrid = newGrid.map((cell) =>
          (cell.x === cell1.x && cell.y === cell1.y) ||
          (cell.x === cell2.x && cell.y === cell2.y) ||
          (cell.x === cell3.x && cell.y === cell3.y) ||
          (cell.x === cell4.x && cell.y === cell4.y)
            ? { ...cell, value: 0, className: "explosion" }
            : cell
        )
      }
    }

    // vérification des colonnes
    for (let y = 1; y < 5; y++) {
      const cell1 = myGrid.find((cell) => cell.x === 1 && cell.y === y)
      const cell2 = myGrid.find((cell) => cell.x === 2 && cell.y === y)
      const cell3 = myGrid.find((cell) => cell.x === 3 && cell.y === y)
      const cell4 = myGrid.find((cell) => cell.x === 4 && cell.y === y)

      if (
        cell1.value !== 0 &&
        cell1.value === cell2.value &&
        cell1.value === cell3.value &&
        cell1.value === cell4.value
      ) {
        setScore((prevstate) => prevstate + 4 * cell1.value)

        newGrid = newGrid.map((cell) =>
          (cell.x === cell1.x && cell.y === cell1.y) ||
          (cell.x === cell2.x && cell.y === cell2.y) ||
          (cell.x === cell3.x && cell.y === cell3.y) ||
          (cell.x === cell4.x && cell.y === cell4.y)
            ? { ...cell, value: 0, className: "explosion" }
            : cell
        )
      }
    }

    // vérification des carrés

    for (let x = 2; x < 4; x++) {
      for (let y = 2; y < 4; y++) {
        const activeCell = myGrid.find((cell) => cell.x === x && cell.y === y)
        const cellUp = myGrid.find((cell) => cell.x === x - 1 && cell.y === y)
        const cellUpLeft = myGrid.find(
          (cell) => cell.x === x - 1 && cell.y === y - 1
        )
        const cellUpRight = myGrid.find(
          (cell) => cell.x === x - 1 && cell.y === y + 1
        )
        const cellDown = myGrid.find((cell) => cell.x === x + 1 && cell.y === y)
        const cellDownLeft = myGrid.find(
          (cell) => cell.x === x + 1 && cell.y === y - 1
        )
        const cellDownRight = myGrid.find(
          (cell) => cell.x === x + 1 && cell.y === y + 1
        )
        const cellLeft = myGrid.find((cell) => cell.x === x && cell.y === y - 1)
        const cellRight = myGrid.find(
          (cell) => cell.x === x && cell.y === y + 1
        )

        if (
          activeCell.value !== 0 &&
          activeCell.value === cellUp.value &&
          activeCell.value === cellUpLeft.value &&
          activeCell.value === cellLeft.value
        ) {
          setScore((prevstate) => prevstate + 4 * activeCell.value)

          newGrid = newGrid.map((cell) =>
            (cell.x === activeCell.x && cell.y === activeCell.y) ||
            (cell.x === cellUp.x && cell.y === cellUp.y) ||
            (cell.x === cellUpLeft.x && cell.y === cellUpLeft.y) ||
            (cell.x === cellLeft.x && cell.y === cellLeft.y)
              ? { ...cell, value: 0, className: "explosion" }
              : cell
          )
        }

        if (
          activeCell.value !== 0 &&
          activeCell.value === cellUp.value &&
          activeCell.value === cellUpRight.value &&
          activeCell.value === cellRight.value
        ) {
          setScore((prevstate) => prevstate + 4 * activeCell.value)

          newGrid = newGrid.map((cell) =>
            (cell.x === activeCell.x && cell.y === activeCell.y) ||
            (cell.x === cellUp.x && cell.y === cellUp.y) ||
            (cell.x === cellUpRight.x && cell.y === cellUpRight.y) ||
            (cell.x === cellRight.x && cell.y === cellRight.y)
              ? { ...cell, value: 0, className: "explosion" }
              : cell
          )
        }

        if (
          activeCell.value !== 0 &&
          activeCell.value === cellDown.value &&
          activeCell.value === cellDownLeft.value &&
          activeCell.value === cellLeft.value
        ) {
          setScore((prevstate) => prevstate + 4 * activeCell.value)

          newGrid = newGrid.map((cell) =>
            (cell.x === activeCell.x && cell.y === activeCell.y) ||
            (cell.x === cellDown.x && cell.y === cellDown.y) ||
            (cell.x === cellDownLeft.x && cell.y === cellDownLeft.y) ||
            (cell.x === cellLeft.x && cell.y === cellLeft.y)
              ? { ...cell, value: 0, className: "explosion" }
              : cell
          )
        }

        if (
          activeCell.value !== 0 &&
          activeCell.value === cellDown.value &&
          activeCell.value === cellDownRight.value &&
          activeCell.value === cellRight.value
        ) {
          setScore((prevstate) => prevstate + 4 * activeCell.value)

          newGrid = newGrid.map((cell) =>
            (cell.x === activeCell.x && cell.y === activeCell.y) ||
            (cell.x === cellDown.x && cell.y === cellDown.y) ||
            (cell.x === cellDownRight.x && cell.y === cellDownRight.y) ||
            (cell.x === cellRight.x && cell.y === cellRight.y)
              ? { ...cell, value: 0, className: "explosion" }
              : cell
          )
        }
      }
    }

    // setGridKill10(newGrid)
    return newGrid
  }

  const handleGameOver = (myGrid) => {
    // let nbVide = 0
    // let sameValueAside = false

    for (let x = 1; x < 5; x++) {
      for (let y = 1; y < 5; y++) {
        const activeCell = myGrid.find((cell) => cell.x === x && cell.y === y)

        if (activeCell.value === 0) {
          // nbVide++
          return false
        }

        const cellXm1 = myGrid.find((cell) => cell.x === x - 1 && cell.y === y)
        const cellXp1 = myGrid.find((cell) => cell.x === x + 1 && cell.y === y)
        const cellYm1 = myGrid.find((cell) => cell.x === x && cell.y === y - 1)
        const cellYp1 = myGrid.find((cell) => cell.x === x && cell.y === y + 1)

        if (cellXm1 !== undefined) {
          if (cellXm1.value + activeCell.value === 10) {
            return false
          }
        }

        if (cellXp1 !== undefined) {
          if (cellXp1.value + activeCell.value === 10) {
            return false
          }
        }

        if (cellYm1 !== undefined) {
          if (cellYm1.value + activeCell.value === 10) {
            return false
          }
        }

        if (cellYp1 !== undefined) {
          if (cellYp1.value + activeCell.value === 10) {
            return false
          }
        }
      }
    }

    setGameOver(true)
    setValuesFallen([])

    axios
      .post("http://localhost:4242/scores", {
        score,
      })
      .then(() => {
        axios
          .get("http://localhost:4242/scores")
          .then(({ data }) => setHighScore(data.score))
      })

    return true
  }

  const swipeLeft = (myGrid, count, newScore) => {
    // let newGrid = gridKill10
    let newGrid = myGrid

    // réinitialisation des classes des cellules si myGrid = gridKill10
    if (myGrid === gridKill10) {
      newGrid = newGrid.map((cell) => ({ ...cell, className: "initial" }))
      // console.log("newgrid initialisation", newGrid)
    }

    let changeGrid = false
    // let oneChangeMergeable = false

    for (let x = 1; x < 5; x++) {
      for (let y = 1; y < 5; y++) {
        const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
        const cellnext = newGrid.find(
          (cell) => cell.x === x && cell.y === y + 1
        )
        if (cell.y < 4) {
          // si cellNext.value + cell.value = 10 alors on supprime la cell en la passant à 0 et on passe cellNext.value à null
          if (
            cellnext.value + cell.value === 10 &&
            cell.mergeable === true &&
            cellnext.mergeable === true
          ) {
            // les cellules ont des valeurs identiques mais différentes de 0

            newGrid = newGrid.map(
              (cellule) =>
                cellule.x === x && cellule.y === y // la cellule regardée
                  ? {
                      ...cellule,
                      value: 0,
                      mergeable: false,
                      className: "disappear",
                    } // double sa valeur et sa valeur ne peut plus fusionner avec une autre cellule
                  : cellule.x === x && cellule.y === y + 1 // la valeur de la cellule suivante
                  ? { ...cellule, value: 0 } // devient 0
                  : cellule // les autres cellules ne bougent pas
            )

            newScore += 10
            changeGrid = true // il y a eu une modification donc changeGrid passe à true
          } else if (cell.value === 0 && cell.className !== "disappear") {
            // la valeur de la cellule est 0 et est différente de la valeur de la cellule suivante
            newGrid = newGrid.map(
              (cellule) =>
                cellule.x === x && cellule.y === y // la cellule regardée
                  ? {
                      ...cellule,
                      value: cellnext.value,
                      className: cellnext.value !== 0 ? "fromRight" : "initial",
                    } // prend la valeur de la cellule suivante
                  : cellule.x === x && cellule.y === y + 1 // la cellule suivante
                  ? { ...cellule, value: 0 } // devient nulle (0) car elle a été déplacée
                  : cellule // les autres cellules ne changent pas
            )

            if (
              cellnext.value !== cell.value &&
              cell.className !== "disappear"
            ) {
              changeGrid = true
            } // il y a eu une modification donc changeGrid passe à true
          }
        }
      }
    }

    // vérification que tous les éléments sont à gauche avant d'ajouter un nouveau nombre
    let allOnLeft = true
    for (let x = 1; x < 5; x++) {
      for (let y = 1; y < 4; y++) {
        const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
        const cellnext = newGrid.find(
          (cell) => cell.x === x && cell.y === y + 1
        )

        if (
          cell.value === 0 &&
          cell.className !== "disappear" &&
          cellnext.value !== 0
        ) {
          allOnLeft = false
        }
      }
    }

    // si allOnLeft = true et que changeGrid = false on rajoute un chiffre
    if (allOnLeft === true && changeGrid === false) {
      if (count > 0) {
        // on vérifie s'il y a des lignes colonnes ou carrés pleins de la même valeur
        newGrid = handleDeleteLineAndSquare(newGrid)

        const newPosition = findFreeRandomPosition(newGrid)
        // on rajoute le nouveau chiffre à la grille
        newGrid = newGrid.map((cell) =>
          cell.x === newPosition.randomX && cell.y === newPosition.randomY
            ? { ...cell, value: handleRandomNewNumber(), className: "appear" }
            : cell
        )

        // on rend de nouveau toutes les cases mergeables
        newGrid = newGrid.map((item) => ({ ...item, mergeable: true }))
      }
    } else {
      handleGameOver(newGrid)
      return swipeLeft(newGrid, count + 1, newScore)
    }

    handleGameOver(newGrid)

    setGridKill10(newGrid)

    setScore(score + newScore)
  }

  // const swipeTop = (myGrid, count, newScore) => {
  //   // let newGrid = gridKill10
  //   let newGrid = myGrid

  //   let changeGrid = false
  //   // let oneChangeMergeable = false

  //   for (let x = 1; x < 5; x++) {
  //     for (let y = 1; y < 5; y++) {
  //       const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
  //       const cellnext = newGrid.find(
  //         (cell) => cell.x === x + 1 && cell.y === y
  //       )
  //       if (cell.x < 4) {
  //         // si cellNext.value = cell.value alors on fusionne en cell et on passe cellNext.value à null
  //         if (
  //           cellnext.value + cell.value === 10 &&
  //           cell.mergeable === true &&
  //           cellnext.mergeable === true
  //         ) {
  //           // si la valeur de la cellule et la suivante sont identiques

  //           // les cellules ont des valeurs identiques mais différentes de 0

  //           newGrid = newGrid.map(
  //             (cellule) =>
  //               cellule.x === x && cellule.y === y // la cellule regardée
  //                 ? {
  //                     ...cellule,
  //                     value: 0,
  //                     mergeable: false,
  //                   } // double sa valeur et sa valeur ne peut plus fusionner avec une autre cellule
  //                 : cellule.x === x + 1 && cellule.y === y // la valeur de la cellule suivante
  //                 ? { ...cellule, value: 0 } // devient 0
  //                 : cellule // les autres cellules ne bougent pas
  //           )

  //           newScore += 10
  //           changeGrid = true // il y a eu une modification donc changeGrid passe à true
  //         } else if (cell.value === 0) {
  //           // la valeur de la cellule est 0 et est différente de la valeur de la cellule suivante
  //           newGrid = newGrid.map(
  //             (cellule) =>
  //               cellule.x === x && cellule.y === y // la cellule regardée
  //                 ? { ...cellule, value: cellnext.value } // prend la valeur de la cellule suivante
  //                 : cellule.x === x + 1 && cellule.y === y // la cellule suivante
  //                 ? { ...cellule, value: 0 } // devient nulle (0) car elle a été déplacée
  //                 : cellule // les autres cellules ne changent pas
  //           )

  //           if (cellnext.value !== cell.value) {
  //             changeGrid = true
  //           } // il y a eu une modification donc changeGrid passe à true
  //         } else if (cell.value !== cellnext.value) {
  //           // les valeurs de la cellule et de la suivante sont différentes mais cell.value !== 0
  //           newGrid = newGrid // on ne fait rien
  //         }
  //       }
  //     }
  //   }

  //   // vérification que tous les éléments sont à gauche avant d'ajouter un nouveau nombre
  //   let allOnTop = true
  //   for (let x = 1; x < 4; x++) {
  //     for (let y = 1; y < 5; y++) {
  //       const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
  //       const cellnext = newGrid.find(
  //         (cell) => cell.x === x + 1 && cell.y === y
  //       )

  //       if (cell.value === 0 && cellnext.value !== 0) {
  //         allOnTop = false
  //       }
  //     }
  //   }

  //   // console.log("allOnTop",allOnTop);
  //   // console.log("changeGrid", changeGrid);

  //   // si allOnTop = true et que changeGrid = false on rajoute un chiffre
  //   if (allOnTop === true && changeGrid === false) {
  //     if (count > 0) {
  //       // on vérifie s'il y a des lignes colonnes ou carrés pleins de la même valeur
  //       newGrid = handleDeleteLineAndSquare(newGrid)

  //       const newPosition = findFreeRandomPosition(newGrid)
  //       // on rajoute le nouveau chiffre à la grille
  //       newGrid = newGrid.map((cell) =>
  //         cell.x === newPosition.randomX && cell.y === newPosition.randomY
  //           ? { ...cell, value: handleRandomNewNumber() }
  //           : cell
  //       )

  //       // on rend de nouveau toutes les cases mergeables
  //       newGrid = newGrid.map((item) => ({ ...item, mergeable: true }))
  //     }
  //   } else {
  //     handleGameOver(newGrid)
  //     return swipeTop(newGrid, count + 1, newScore)
  //   }

  //   handleGameOver(newGrid)
  //   setGridKill10(newGrid)
  //   setScore(score + newScore)
  // }

  const swipeTop = (myGrid, count, newScore) => {
    // let newGrid = gridKill10
    let newGrid = myGrid

    // réinitialisation des classes des cellules si myGrid = gridKill10
    if (myGrid === gridKill10) {
      newGrid = newGrid.map((cell) => ({ ...cell, className: "initial" }))
      // console.log("newgrid initialisation", newGrid)
    }

    let changeGrid = false
    // let oneChangeMergeable = false

    for (let x = 1; x < 5; x++) {
      for (let y = 1; y < 5; y++) {
        const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
        const cellnext = newGrid.find(
          (cell) => cell.x === x + 1 && cell.y === y
        )
        if (cell.x < 4) {
          // si cellNext.value + cell.value = 10 alors on supprime la cell en la passant à 0 et on passe cellNext.value à null
          if (
            cellnext.value + cell.value === 10 &&
            cell.mergeable === true &&
            cellnext.mergeable === true
          ) {
            // les cellules ont des valeurs identiques mais différentes de 0

            newGrid = newGrid.map(
              (cellule) =>
                cellule.x === x && cellule.y === y // la cellule regardée
                  ? {
                      ...cellule,
                      value: 0,
                      mergeable: false,
                      className: "disappear",
                    } // double sa valeur et sa valeur ne peut plus fusionner avec une autre cellule
                  : cellule.x === x + 1 && cellule.y === y // la valeur de la cellule suivante
                  ? { ...cellule, value: 0 } // devient 0
                  : cellule // les autres cellules ne bougent pas
            )

            newScore += 10
            changeGrid = true // il y a eu une modification donc changeGrid passe à true
          } else if (cell.value === 0 && cell.className !== "disappear") {
            // la valeur de la cellule est 0 et est différente de la valeur de la cellule suivante
            newGrid = newGrid.map(
              (cellule) =>
                cellule.x === x && cellule.y === y // la cellule regardée
                  ? {
                      ...cellule,
                      value: cellnext.value,
                      className:
                        cellnext.value !== 0 ? "fromBottom" : "initial",
                    } // prend la valeur de la cellule suivante
                  : cellule.x === x + 1 && cellule.y === y // la cellule suivante
                  ? { ...cellule, value: 0 } // devient nulle (0) car elle a été déplacée
                  : cellule // les autres cellules ne changent pas
            )

            if (
              cellnext.value !== cell.value &&
              cell.className !== "disappear"
            ) {
              changeGrid = true
            } // il y a eu une modification donc changeGrid passe à true
          }
        }
      }
    }

    // vérification que tous les éléments sont à gauche avant d'ajouter un nouveau nombre
    let allOnTop = true
    for (let x = 1; x < 4; x++) {
      for (let y = 1; y < 5; y++) {
        const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
        const cellnext = newGrid.find(
          (cell) => cell.x === x + 1 && cell.y === y
        )

        if (
          cell.value === 0 &&
          cell.className !== "disappear" &&
          cellnext.value !== 0
        ) {
          allOnTop = false
        }
      }
    }

    // si allOnTop = true et que changeGrid = false on rajoute un chiffre
    if (allOnTop === true && changeGrid === false) {
      if (count > 0) {
        // on vérifie s'il y a des lignes colonnes ou carrés pleins de la même valeur
        newGrid = handleDeleteLineAndSquare(newGrid)

        const newPosition = findFreeRandomPosition(newGrid)
        // on rajoute le nouveau chiffre à la grille
        newGrid = newGrid.map((cell) =>
          cell.x === newPosition.randomX && cell.y === newPosition.randomY
            ? { ...cell, value: handleRandomNewNumber(), className: "appear" }
            : cell
        )

        // on rend de nouveau toutes les cases mergeables
        newGrid = newGrid.map((item) => ({ ...item, mergeable: true }))
      }
    } else {
      handleGameOver(newGrid)
      return swipeTop(newGrid, count + 1, newScore)
    }

    handleGameOver(newGrid)

    setGridKill10(newGrid)

    setScore(score + newScore)
  }

  // const swipeRight = (myGrid, count, newScore) => {
  //   // let newGrid = gridKill10
  //   let newGrid = myGrid

  //   let changeGrid = false
  //   // let oneChangeMergeable = false

  //   for (let x = 1; x < 5; x++) {
  //     for (let y = 4; y > 0; y--) {
  //       const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
  //       const cellnext = newGrid.find(
  //         (cell) => cell.x === x && cell.y === y - 1
  //       )
  //       if (cell.y > 1) {
  //         // si cellNext.value = cell.value alors on fusionne en cell et on passe cellNext.value à null
  //         if (
  //           cellnext.value + cell.value === 10 &&
  //           cell.mergeable === true &&
  //           cellnext.mergeable === true
  //         ) {
  //           // si la valeur de la cellule et la suivante sont identiques

  //           // les cellules ont des valeurs identiques mais différentes de 0

  //           newGrid = newGrid.map(
  //             (cellule) =>
  //               cellule.x === x && cellule.y === y // la cellule regardée
  //                 ? {
  //                     ...cellule,
  //                     value: 0,
  //                     mergeable: false,
  //                   } // double sa valeur et sa valeur ne peut plus fusionner avec une autre cellule
  //                 : cellule.x === x && cellule.y === y - 1 // la valeur de la cellule suivante
  //                 ? { ...cellule, value: 0 } // devient 0
  //                 : cellule // les autres cellules ne bougent pas
  //           )

  //           newScore += 10
  //           changeGrid = true // il y a eu une modification donc changeGrid passe à true
  //         } else if (cell.value === 0) {
  //           // la valeur de la cellule est 0 et est différente de la valeur de la cellule suivante
  //           newGrid = newGrid.map(
  //             (cellule) =>
  //               cellule.x === x && cellule.y === y // la cellule regardée
  //                 ? { ...cellule, value: cellnext.value } // prend la valeur de la cellule suivante
  //                 : cellule.x === x && cellule.y === y - 1 // la cellule suivante
  //                 ? { ...cellule, value: 0 } // devient nulle (0) car elle a été déplacée
  //                 : cellule // les autres cellules ne changent pas
  //           )

  //           if (cellnext.value !== cell.value) {
  //             changeGrid = true
  //           } // il y a eu une modification donc changeGrid passe à true
  //         } else if (cell.value !== cellnext.value) {
  //           // les valeurs de la cellule et de la suivante sont différentes mais cell.value !== 0
  //           newGrid = newGrid // on ne fait rien
  //         }
  //       }
  //     }
  //   }

  //   // vérification que tous les éléments sont à gauche avant d'ajouter un nouveau nombre
  //   let allOnRight = true
  //   for (let x = 1; x < 5; x++) {
  //     for (let y = 4; y > 1; y--) {
  //       const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
  //       const cellnext = newGrid.find(
  //         (cell) => cell.x === x && cell.y === y - 1
  //       )

  //       if (cell.value === 0 && cellnext.value !== 0) {
  //         allOnRight = false
  //       }
  //     }
  //   }

  //   // console.log("allOnRight",allOnRight);
  //   // console.log("changeGrid", changeGrid);

  //   // si allOnRight = true et que changeGrid = false on rajoute un chiffre
  //   if (allOnRight === true && changeGrid === false) {
  //     if (count > 0) {
  //       // on vérifie s'il y a des lignes colonnes ou carrés pleins de la même valeur
  //       newGrid = handleDeleteLineAndSquare(newGrid)

  //       const newPosition = findFreeRandomPosition(newGrid)
  //       // on rajoute le nouveau chiffre à la grille
  //       newGrid = newGrid.map((cell) =>
  //         cell.x === newPosition.randomX && cell.y === newPosition.randomY
  //           ? { ...cell, value: handleRandomNewNumber() }
  //           : cell
  //       )

  //       // on rend de nouveau toutes les cases mergeables
  //       newGrid = newGrid.map((item) => ({ ...item, mergeable: true }))
  //     }
  //   } else {
  //     handleGameOver(newGrid)
  //     return swipeRight(newGrid, count + 1, newScore)
  //   }

  //   handleGameOver(newGrid)
  //   setGridKill10(newGrid)
  //   setScore(score + newScore)
  // }

  const swipeRight = (myGrid, count, newScore) => {
    // let newGrid = gridKill10
    let newGrid = myGrid

    // réinitialisation des classes des cellules si myGrid = gridKill10
    if (myGrid === gridKill10) {
      newGrid = newGrid.map((cell) => ({ ...cell, className: "initial" }))
      // console.log("newgrid initialisation", newGrid)
    }

    let changeGrid = false
    // let oneChangeMergeable = false

    for (let x = 1; x < 5; x++) {
      for (let y = 4; y > 0; y--) {
        const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
        const cellnext = newGrid.find(
          (cell) => cell.x === x && cell.y === y - 1
        )
        if (cell.y > 1) {
          // si cellNext.value + cell.value = 10 alors on supprime la cell en la passant à 0 et on passe cellNext.value à null
          if (
            cellnext.value + cell.value === 10 &&
            cell.mergeable === true &&
            cellnext.mergeable === true
          ) {
            // les cellules ont des valeurs identiques mais différentes de 0

            newGrid = newGrid.map(
              (cellule) =>
                cellule.x === x && cellule.y === y // la cellule regardée
                  ? {
                      ...cellule,
                      value: 0,
                      mergeable: false,
                      className: "disappear",
                    } // double sa valeur et sa valeur ne peut plus fusionner avec une autre cellule
                  : cellule.x === x && cellule.y === y - 1 // la valeur de la cellule suivante
                  ? { ...cellule, value: 0 } // devient 0
                  : cellule // les autres cellules ne bougent pas
            )

            newScore += 10
            changeGrid = true // il y a eu une modification donc changeGrid passe à true
          } else if (cell.value === 0 && cell.className !== "disappear") {
            // la valeur de la cellule est 0 et est différente de la valeur de la cellule suivante
            newGrid = newGrid.map(
              (cellule) =>
                cellule.x === x && cellule.y === y // la cellule regardée
                  ? {
                      ...cellule,
                      value: cellnext.value,
                      className: cellnext.value !== 0 ? "fromLeft" : "initial",
                    } // prend la valeur de la cellule suivante
                  : cellule.x === x && cellule.y === y - 1 // la cellule suivante
                  ? { ...cellule, value: 0 } // devient nulle (0) car elle a été déplacée
                  : cellule // les autres cellules ne changent pas
            )

            if (
              cellnext.value !== cell.value &&
              cell.className !== "disappear"
            ) {
              changeGrid = true
            } // il y a eu une modification donc changeGrid passe à true
          }
        }
      }
    }

    // vérification que tous les éléments sont à gauche avant d'ajouter un nouveau nombre
    let allOnRight = true
    for (let x = 1; x < 5; x++) {
      for (let y = 4; y > 1; y--) {
        const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
        const cellnext = newGrid.find(
          (cell) => cell.x === x && cell.y === y - 1
        )

        if (
          cell.value === 0 &&
          cell.className !== "disappear" &&
          cellnext.value !== 0
        ) {
          allOnRight = false
        }
      }
    }

    // si allOnRight = true et que changeGrid = false on rajoute un chiffre
    if (allOnRight === true && changeGrid === false) {
      if (count > 0) {
        // on vérifie s'il y a des lignes colonnes ou carrés pleins de la même valeur
        newGrid = handleDeleteLineAndSquare(newGrid)

        const newPosition = findFreeRandomPosition(newGrid)
        // on rajoute le nouveau chiffre à la grille
        newGrid = newGrid.map((cell) =>
          cell.x === newPosition.randomX && cell.y === newPosition.randomY
            ? { ...cell, value: handleRandomNewNumber(), className: "appear" }
            : cell
        )

        // on rend de nouveau toutes les cases mergeables
        newGrid = newGrid.map((item) => ({ ...item, mergeable: true }))
      }
    } else {
      handleGameOver(newGrid)
      return swipeRight(newGrid, count + 1, newScore)
    }

    handleGameOver(newGrid)

    setGridKill10(newGrid)

    setScore(score + newScore)
  }

  // const swipeBottom = (myGrid, count, newScore) => {
  //   // let newGrid = gridKill10
  //   let newGrid = myGrid

  //   let changeGrid = false
  //   // let oneChangeMergeable = false

  //   for (let x = 4; x > 0; x--) {
  //     for (let y = 1; y < 5; y++) {
  //       const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
  //       const cellnext = newGrid.find(
  //         (cell) => cell.x === x - 1 && cell.y === y
  //       )
  //       if (cell.x > 1) {
  //         // si cellNext.value = cell.value alors on fusionne en cell et on passe cellNext.value à null
  //         if (
  //           cellnext.value + cell.value === 10 &&
  //           cell.mergeable === true &&
  //           cellnext.mergeable === true
  //         ) {
  //           // si la valeur de la cellule et la suivante sont identiques

  //           // les cellules ont des valeurs identiques mais différentes de 0

  //           newGrid = newGrid.map(
  //             (cellule) =>
  //               cellule.x === x && cellule.y === y // la cellule regardée
  //                 ? {
  //                     ...cellule,
  //                     value: 0,
  //                     mergeable: false,
  //                   } // double sa valeur et sa valeur ne peut plus fusionner avec une autre cellule
  //                 : cellule.x === x - 1 && cellule.y === y // la valeur de la cellule suivante
  //                 ? { ...cellule, value: 0 } // devient 0
  //                 : cellule // les autres cellules ne bougent pas
  //           )

  //           newScore += 10
  //           changeGrid = true // il y a eu une modification donc changeGrid passe à true
  //         } else if (cell.value === 0) {
  //           // la valeur de la cellule est 0 et est différente de la valeur de la cellule suivante
  //           newGrid = newGrid.map(
  //             (cellule) =>
  //               cellule.x === x && cellule.y === y // la cellule regardée
  //                 ? { ...cellule, value: cellnext.value } // prend la valeur de la cellule suivante
  //                 : cellule.x === x - 1 && cellule.y === y // la cellule suivante
  //                 ? { ...cellule, value: 0 } // devient nulle (0) car elle a été déplacée
  //                 : cellule // les autres cellules ne changent pas
  //           )

  //           if (cellnext.value !== cell.value) {
  //             changeGrid = true
  //           } // il y a eu une modification donc changeGrid passe à true
  //         } else if (cell.value !== cellnext.value) {
  //           // les valeurs de la cellule et de la suivante sont différentes mais cell.value !== 0
  //           newGrid = newGrid // on ne fait rien
  //         }
  //       }
  //     }
  //   }

  //   // vérification que tous les éléments sont à gauche avant d'ajouter un nouveau nombre
  //   let allOnBottom = true
  //   for (let x = 4; x > 1; x--) {
  //     for (let y = 1; y < 5; y++) {
  //       const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
  //       const cellnext = newGrid.find(
  //         (cell) => cell.x === x - 1 && cell.y === y
  //       )

  //       if (cell.value === 0 && cellnext.value !== 0) {
  //         allOnBottom = false
  //       }
  //     }
  //   }

  //   // console.log("allOnBottom",allOnBottom);
  //   // console.log("changeGrid", changeGrid);

  //   // si allOnBottom = true et que changeGrid = false on rajoute un chiffre
  //   if (allOnBottom === true && changeGrid === false) {
  //     if (count > 0) {
  //       // on vérifie s'il y a des lignes colonnes ou carrés pleins de la même valeur
  //       newGrid = handleDeleteLineAndSquare(newGrid)

  //       const newPosition = findFreeRandomPosition(newGrid)
  //       // on rajoute le nouveau chiffre à la grille
  //       newGrid = newGrid.map((cell) =>
  //         cell.x === newPosition.randomX && cell.y === newPosition.randomY
  //           ? { ...cell, value: handleRandomNewNumber() }
  //           : cell
  //       )

  //       // on rend de nouveau toutes les cases mergeables
  //       newGrid = newGrid.map((item) => ({ ...item, mergeable: true }))
  //     }
  //   } else {
  //     handleGameOver(newGrid)
  //     return swipeBottom(newGrid, count + 1, newScore)
  //   }

  //   handleGameOver(newGrid)
  //   setGridKill10(newGrid)
  //   setScore(score + newScore)
  // }

  const swipeBottom = (myGrid, count, newScore) => {
    // let newGrid = gridKill10
    let newGrid = myGrid

    // réinitialisation des classes des cellules si myGrid = gridKill10
    if (myGrid === gridKill10) {
      newGrid = newGrid.map((cell) => ({ ...cell, className: "initial" }))
      // console.log("newgrid initialisation", newGrid)
    }

    let changeGrid = false
    // let oneChangeMergeable = false

    for (let x = 4; x > 0; x--) {
      for (let y = 1; y < 5; y++) {
        const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
        const cellnext = newGrid.find(
          (cell) => cell.x === x - 1 && cell.y === y
        )
        if (cell.x > 1) {
          // si cellNext.value + cell.value = 10 alors on supprime la cell en la passant à 0 et on passe cellNext.value à null
          if (
            cellnext.value + cell.value === 10 &&
            cell.mergeable === true &&
            cellnext.mergeable === true
          ) {
            // les cellules ont des valeurs identiques mais différentes de 0

            newGrid = newGrid.map(
              (cellule) =>
                cellule.x === x && cellule.y === y // la cellule regardée
                  ? {
                      ...cellule,
                      value: 0,
                      mergeable: false,
                      className: "disappear",
                    } // double sa valeur et sa valeur ne peut plus fusionner avec une autre cellule
                  : cellule.x === x - 1 && cellule.y === y // la valeur de la cellule suivante
                  ? { ...cellule, value: 0 } // devient 0
                  : cellule // les autres cellules ne bougent pas
            )

            newScore += 10
            changeGrid = true // il y a eu une modification donc changeGrid passe à true
          } else if (cell.value === 0 && cell.className !== "disappear") {
            // la valeur de la cellule est 0 et est différente de la valeur de la cellule suivante
            newGrid = newGrid.map(
              (cellule) =>
                cellule.x === x && cellule.y === y // la cellule regardée
                  ? {
                      ...cellule,
                      value: cellnext.value,
                      className: cellnext.value !== 0 ? "fromTop" : "initial",
                    } // prend la valeur de la cellule suivante
                  : cellule.x === x - 1 && cellule.y === y // la cellule suivante
                  ? { ...cellule, value: 0 } // devient nulle (0) car elle a été déplacée
                  : cellule // les autres cellules ne changent pas
            )

            if (
              cellnext.value !== cell.value &&
              cell.className !== "disappear"
            ) {
              changeGrid = true
            } // il y a eu une modification donc changeGrid passe à true
          }
        }
      }
    }

    // vérification que tous les éléments sont à gauche avant d'ajouter un nouveau nombre
    let allOnBottom = true
    for (let x = 4; x > 1; x--) {
      for (let y = 1; y < 5; y++) {
        const cell = newGrid.find((cell) => cell.x === x && cell.y === y)
        const cellnext = newGrid.find(
          (cell) => cell.x === x - 1 && cell.y === y
        )

        if (
          cell.value === 0 &&
          cell.className !== "disappear" &&
          cellnext.value !== 0
        ) {
          allOnBottom = false
        }
      }
    }

    // si allOnBottom = true et que changeGrid = false on rajoute un chiffre
    if (allOnBottom === true && changeGrid === false) {
      if (count > 0) {
        // on vérifie s'il y a des lignes colonnes ou carrés pleins de la même valeur
        newGrid = handleDeleteLineAndSquare(newGrid)

        const newPosition = findFreeRandomPosition(newGrid)
        // on rajoute le nouveau chiffre à la grille
        newGrid = newGrid.map((cell) =>
          cell.x === newPosition.randomX && cell.y === newPosition.randomY
            ? { ...cell, value: handleRandomNewNumber(), className: "appear" }
            : cell
        )

        // on rend de nouveau toutes les cases mergeables
        newGrid = newGrid.map((item) => ({ ...item, mergeable: true }))
      }
    } else {
      handleGameOver(newGrid)
      return swipeBottom(newGrid, count + 1, newScore)
    }

    handleGameOver(newGrid)

    setGridKill10(newGrid)

    setScore(score + newScore)
  }

  // Créer une fonction qui gère l'événement onKeyDown
  const handleKeyDown = (event) => {
    // Récupérer le code de la touche enfoncée
    const keyCode = event.keyCode

    // Comparer le code avec les codes des touches flèches
    switch (keyCode) {
      case 37: // Flèche gauche
        swipeLeft(gridKill10, 0, 0)
        break
      case 38: // Flèche haut
        swipeTop(gridKill10, 0, 0)
        break
      case 39: // Flèche droite
        swipeRight(gridKill10, 0, 0)
        break
      case 40: // Flèche bas
        swipeBottom(gridKill10, 0, 0)
        break
      default:
        break
    }
  }

  const handleRestart = () => {
    setScore(0)
    setGameOver(false)

    let newGrid = createGrid()
    const firstPosition = findFreeRandomPosition(newGrid)
    newGrid = newGrid.map((cell) =>
      cell.x === firstPosition.randomX && cell.y === firstPosition.randomY
        ? { ...cell, value: handleRandomNewNumber() }
        : cell
    )
    const secondPosition = findFreeRandomPosition(newGrid)
    newGrid = newGrid.map((cell) =>
      cell.x === secondPosition.randomX && cell.y === secondPosition.randomY
        ? { ...cell, value: handleRandomNewNumber() }
        : cell
    )
    setGridKill10(newGrid)
  }

  useEffect(() => {
    handleRestart()

    axios
      .get("http://localhost:4242/scores")
      .then(({ data }) => setHighScore(data.score))
  }, [])

  useEffect(() => {
    if (score > 100 && !pass100) {
      setPass100(true)
    }
    if (score > 200 && !pass200) {
      setPass200(true)
    }
    if (score > 300 && !pass300) {
      setPass300(true)
    }
  }, [score])

  useEffect(() => {
    setValuesFallen([])
  }, [pass100, pass200, pass300])

  // useEffect(() => {
  //   console.log(gridKill10)
  // }, [gridKill10])

  return (
    <main className="main-home" tabIndex="0" onKeyDown={handleKeyDown}>
      <div className="game-container">
        <section className="score-container">
          <h1
            title="Restart"
            onClick={handleRestart}
            // style={
            //   gridKill10[0]
            //     ? {
            //         color: colorValues.find(
            //           (color) =>
            //             color.value ===
            //             Math.max(...gridKill10.map((cell) => cell.value))
            //         ).color,
            //       }
            //     : null
            // }
          >
            Kill10
          </h1>
          <div className="div-score">
            <h2>Score</h2>
            <p>{score}</p>
          </div>
          <div className="div-score">
            <h2>High score</h2>
            <p>{highScore || 0}</p>
          </div>
        </section>
        <section className="section-2048-container">
          {gridKill10.map((cell) => (
            <div
              // className={cell.value !== 0 ? "cell2048" : `cell2048 ${cell.className}`}
              className="cell2048"
              // style={
              //   cell.value !== 0
              //     ? {
              //         backgroundColor: colorValues.find(
              //           (color) => color.value === cell.value
              //         ).color,
              //       }
              //     : null
              // }
              key={"x" + cell.x + " - y" + cell.y}
            >
              {
                <p
                  // className={
                  //   cell.value !== 0 ? "textCell" : `textCell ${cell.className}`
                  // }
                  className={cell.className ? cell.className : "textCell"}
                  style={
                    cell.value !== 0
                      ? {
                          backgroundColor: colorValues.find(
                            (color) => color.value === cell.value
                          ).color,
                        }
                      : null
                  }
                >
                  {cell.value}
                </p>
                // <p>{"x" + cell.x + " - y"  + cell.y + "val" + cell.value + "  " + cell.mergeable} </p>
              }
            </div>
          ))}
        </section>
        {gameOver && <h1 className="gameover">Game Over</h1>}
      </div>
    </main>
  )
}
