import React, { useState, useEffect } from 'react';
import { Container, Spinner } from 'react-bootstrap';
import { useConnect, useCanister } from "@connect2ic/react";

const VotingPower = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const { isConnected } = useConnect();
  const [backend] = useCanister("backend");

  useEffect(() => {
    if (!isConnected || !backend) {
      return;
    }

    const fetchData = async () => {

      let symbolKey = Symbol.for('ic-agent-metadata');
      let keysCount = Object.keys(await backend[symbolKey].config.agent._identity).length > 0;
      
      if(keysCount == 0){
        return;
      }

      const fetchedLeaderboard = await backend.getVotingPowerLeaderboard();
      
      const leaderboardWithProfileIcons = fetchedLeaderboard.map(entry => {
        const profileIconURL = URL.createObjectURL(entry.profileIconBlob);
        return { ...entry, profileIcon: profileIconURL };
      });

      setLeaderboard(leaderboardWithProfileIcons);
      
      setIsLoading(false);
    };
    fetchData();

  }, [isConnected, backend]);

  return (
      isLoading ? (
          <div className="customOverlay d-flex flex-column align-items-center justify-content-center">
              <Spinner animation="border" />
              <p className='text-center mt-1'>Loading</p>
          </div>
      ) :
      (
        <Container className="flex-grow-1 my-5">

            <Table bordered responsive className="mt-1 custom-table">
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((entry) => (
                        <tr key={entry.wallet}>
                            <td>{entry.position}</td>
                            <td>
                                <img src={entry.profileIcon} alt="profile_icon" style={{ maxWidth: '40px', maxHeight: '100%' }} />
                            </td>
                            <td>{entry.principalName == entry.displayName ? "Unknown" : entry.displayName}</td>
                            <td>{entry.votingPower}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>    
        </Container>
    )
  );

};

export default VotingPower;
