import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import Cell from './Cell';

const HorizonatalPath = React.memo(({color, cells}) => {
  const groupedCells = useMemo(() => {
    const groups = [];
    for (let i = 0; i < cells.length; i += 6) {
      groups.push(cells.slice(i, i + 6));
    }

    return groups;
  }, [cells]);

  return (
    <View
      style={{
        height: '100%',
        width: '40%',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <View
        style={{
          height: '100%',
          width: '100%',
          flexDirection: 'column',
        }}>
        {groupedCells.map((group, groupIndex) => (
          <View
            key={`group=${groupIndex}`}
            style={{
              width: '16.7%',
              height: '33.3%',
              flexDirection: 'row',
            }}>
            {group.map(id => {
              return (
                <Cell key={`cell-${id}`}  id={id} color={color} />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
});

export default HorizonatalPath;

const styles = StyleSheet.create({});
